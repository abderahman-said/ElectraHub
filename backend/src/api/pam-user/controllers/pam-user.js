'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::pam-user.pam-user', {
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Hash password
    if (data.password) {
      const bcrypt = require('bcryptjs');
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    // Create audit log
    await strapi.service('api::audit-log.audit-log').create({
      data: {
        action: 'CREATE_USER',
        resource: 'pam-user',
        details: { username: data.username, email: data.email },
        ipAddress: ctx.request.ip,
        userAgent: ctx.request.headers['user-agent'],
        user: ctx.state.user?.id
      }
    });
    
    const response = await super.create(ctx);
    return response;
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    
    // Log original data before update
    const original = await strapi.entityService.findOne('api::pam-user.pam-user', id);
    
    // Hash password if being updated
    if (data.password) {
      const bcrypt = require('bcryptjs');
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    // Create audit log
    await strapi.service('api::audit-log.audit-log').create({
      data: {
        action: 'UPDATE_USER',
        resource: 'pam-user',
        resourceId: id,
        details: { 
          original: original, 
          changes: data 
        },
        ipAddress: ctx.request.ip,
        userAgent: ctx.request.headers['user-agent'],
        user: ctx.state.user?.id
      }
    });
    
    const response = await super.update(ctx);
    return response;
  },

  async delete(ctx) {
    const { id } = ctx.params;
    
    // Log user deletion
    const user = await strapi.entityService.findOne('api::pam-user.pam-user', id);
    
    // Create audit log
    await strapi.service('api::audit-log.audit-log').create({
      data: {
        action: 'DELETE_USER',
        resource: 'pam-user',
        resourceId: id,
        details: { deletedUser: user },
        ipAddress: ctx.request.ip,
        userAgent: ctx.request.headers['user-agent'],
        user: ctx.state.user?.id
      }
    });
    
    const response = await super.delete(ctx);
    return response;
  },

  async login(ctx) {
    const { username, password } = ctx.request.body;
    
    if (!username || !password) {
      return ctx.badRequest('Username and password are required');
    }
    
    // Find user
    const user = await strapi.entityService.findOne('api::pam-user.pam-user', {
      filters: { 
        $or: [
          { username: username },
          { email: username }
        ]
      },
      populate: ['roles', 'permissions']
    });
    
    if (!user) {
      // Log failed login attempt
      await strapi.service('api::audit-log.audit-log').create({
        data: {
          action: 'LOGIN_FAILED',
          resource: 'auth',
          details: { username, reason: 'User not found' },
          ipAddress: ctx.request.ip,
          userAgent: ctx.request.headers['user-agent'],
          status: 'failure'
        }
      });
      
      return ctx.unauthorized('Invalid credentials');
    }
    
    // Check user status
    if (user.status !== 'active') {
      await strapi.service('api::audit-log.audit-log').create({
        data: {
          action: 'LOGIN_FAILED',
          resource: 'auth',
          details: { username, reason: 'User not active', status: user.status },
          ipAddress: ctx.request.ip,
          userAgent: ctx.request.headers['user-agent'],
          user: user.id,
          status: 'failure'
        }
      });
      
      return ctx.unauthorized('Account is not active');
    }
    
    // Verify password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      // Increment login attempts
      await strapi.entityService.update('api::pam-user.pam-user', user.id, {
        data: {
          loginAttempts: user.loginAttempts + 1
        }
      });
      
      // Log failed login
      await strapi.service('api::audit-log.audit-log').create({
        data: {
          action: 'LOGIN_FAILED',
          resource: 'auth',
          details: { username, reason: 'Invalid password', attempts: user.loginAttempts + 1 },
          ipAddress: ctx.request.ip,
          userAgent: ctx.request.headers['user-agent'],
          user: user.id,
          status: 'failure'
        }
      });
      
      return ctx.unauthorized('Invalid credentials');
    }
    
    // Reset login attempts and update last login
    await strapi.entityService.update('api::pam-user.pam-user', user.id, {
      data: {
        loginAttempts: 0,
        lastLogin: new Date()
      }
    });
    
    // Create session
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        accessLevel: user.accessLevel 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    await strapi.service('api::session.session').create({
      data: {
        token,
        ipAddress: ctx.request.ip,
        userAgent: ctx.request.headers['user-agent'],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        lastActivity: new Date(),
        user: user.id
      }
    });
    
    // Log successful login
    await strapi.service('api::audit-log.audit-log').create({
      data: {
        action: 'LOGIN_SUCCESS',
        resource: 'auth',
        details: { username },
        ipAddress: ctx.request.ip,
        userAgent: ctx.request.headers['user-agent'],
        user: user.id,
        status: 'success'
      }
    });
    
    // Remove password from response
    delete user.password;
    
    return {
      user,
      token
    };
  },

  async logout(ctx) {
    const token = ctx.request.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Deactivate session
      await strapi.entityService.update('api::session.session', {
        filters: { token },
        data: { isActive: false }
      });
      
      // Log logout
      await strapi.service('api::audit-log.audit-log').create({
        data: {
          action: 'LOGOUT',
          resource: 'auth',
          details: {},
          ipAddress: ctx.request.ip,
          userAgent: ctx.request.headers['user-agent'],
          user: ctx.state.user?.id,
          status: 'success'
        }
      });
    }
    
    return { message: 'Logged out successfully' };
  }
});
