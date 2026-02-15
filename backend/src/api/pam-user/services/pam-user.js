'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pam-user.pam-user', ({ strapi }) => ({
  async checkPermission(userId, resource, action) {
    const user = await strapi.entityService.findOne('api::pam-user.pam-user', userId, {
      populate: ['permissions', 'roles.permissions']
    });
    
    if (!user) {
      return false;
    }
    
    // Check direct permissions
    const directPermissions = user.permissions || [];
    const hasDirectPermission = directPermissions.some(perm => 
      perm.resource === resource && perm.action === action
    );
    
    if (hasDirectPermission) {
      return true;
    }
    
    // Check role permissions
    const rolePermissions = user.roles?.flatMap(role => role.permissions) || [];
    const hasRolePermission = rolePermissions.some(perm => 
      perm.resource === resource && perm.action === action
    );
    
    return hasRolePermission;
  },

  async getUserSessions(userId) {
    return await strapi.entityService.findMany('api::session.session', {
      filters: { 
        user: userId,
        isActive: true 
      },
      orderBy: { lastActivity: 'desc' }
    });
  },

  async revokeAllSessions(userId) {
    const sessions = await strapi.entityService.findMany('api::session.session', {
      filters: { 
        user: userId,
        isActive: true 
      }
    });
    
    for (const session of sessions) {
      await strapi.entityService.update('api::session.session', session.id, {
        data: { isActive: false }
      });
    }
    
    return sessions.length;
  },

  async updateUserStatus(userId, status) {
    const user = await strapi.entityService.update('api::pam-user.pam-user', userId, {
      data: { status }
    });
    
    // If suspending user, revoke all sessions
    if (status === 'suspended') {
      await this.revokeAllSessions(userId);
    }
    
    return user;
  },

  async getAuditLogs(userId, limit = 50) {
    return await strapi.entityService.findMany('api::audit-log.audit-log', {
      filters: { user: userId },
      orderBy: { timestamp: 'desc' },
      limit
    });
  }
}));
