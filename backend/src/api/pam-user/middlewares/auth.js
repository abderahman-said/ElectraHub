'use strict';

const jwt = require('jsonwebtoken');

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const token = ctx.request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return ctx.unauthorized('No token provided');
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if session is still active
      const session = await strapi.entityService.findOne('api::session.session', {
        filters: { 
          token,
          isActive: true 
        }
      });
      
      if (!session) {
        return ctx.unauthorized('Session expired');
      }
      
      // Update session activity
      await strapi.entityService.update('api::session.session', session.id, {
        data: { 
          lastActivity: new Date() 
        }
      });
      
      // Get user with permissions
      const user = await strapi.entityService.findOne('api::pam-user.pam-user', decoded.id, {
        populate: ['roles', 'permissions']
      });
      
      if (!user || user.status !== 'active') {
        return ctx.unauthorized('User not found or inactive');
      }
      
      ctx.state.user = user;
      ctx.state.userAccessLevel = user.accessLevel;
      
      await next();
    } catch (error) {
      return ctx.unauthorized('Invalid token');
    }
  };
};
