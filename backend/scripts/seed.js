'use strict';

const bcrypt = require('bcryptjs');

async function seed() {
  // Create default roles
  const roles = [
    {
      name: 'Super Admin',
      description: 'Full system access',
      level: 'super_admin',
      isSystem: true
    },
    {
      name: 'Admin',
      description: 'Administrative access',
      level: 'admin',
      isSystem: true
    },
    {
      name: 'Manager',
      description: 'Manager level access',
      level: 'advanced',
      isSystem: true
    },
    {
      name: 'Operator',
      description: 'Basic operational access',
      level: 'intermediate',
      isSystem: true
    },
    {
      name: 'Viewer',
      description: 'Read-only access',
      level: 'basic',
      isSystem: true
    }
  ];

  for (const role of roles) {
    try {
      await strapi.entityService.create('api::role.role', {
        data: role
      });
      console.log(`Created role: ${role.name}`);
    } catch (error) {
      console.log(`Role ${role.name} already exists`);
    }
  }

  // Create default permissions
  const permissions = [
    // User management
    { name: 'create_users', resource: 'pam-user', action: 'create', description: 'Create new users', isSystem: true },
    { name: 'read_users', resource: 'pam-user', action: 'read', description: 'View users', isSystem: true },
    { name: 'update_users', resource: 'pam-user', action: 'update', description: 'Update users', isSystem: true },
    { name: 'delete_users', resource: 'pam-user', action: 'delete', description: 'Delete users', isSystem: true },
    { name: 'admin_users', resource: 'pam-user', action: 'admin', description: 'Full user administration', isSystem: true },
    
    // Role management
    { name: 'create_roles', resource: 'role', action: 'create', description: 'Create new roles', isSystem: true },
    { name: 'read_roles', resource: 'role', action: 'read', description: 'View roles', isSystem: true },
    { name: 'update_roles', resource: 'role', action: 'update', description: 'Update roles', isSystem: true },
    { name: 'delete_roles', resource: 'role', action: 'delete', description: 'Delete roles', isSystem: true },
    { name: 'admin_roles', resource: 'role', action: 'admin', description: 'Full role administration', isSystem: true },
    
    // Permission management
    { name: 'create_permissions', resource: 'permission', action: 'create', description: 'Create new permissions', isSystem: true },
    { name: 'read_permissions', resource: 'permission', action: 'read', description: 'View permissions', isSystem: true },
    { name: 'update_permissions', resource: 'permission', action: 'update', description: 'Update permissions', isSystem: true },
    { name: 'delete_permissions', resource: 'permission', action: 'delete', description: 'Delete permissions', isSystem: true },
    { name: 'admin_permissions', resource: 'permission', action: 'admin', description: 'Full permission administration', isSystem: true },
    
    // Session management
    { name: 'read_sessions', resource: 'session', action: 'read', description: 'View active sessions', isSystem: true },
    { name: 'delete_sessions', resource: 'session', action: 'delete', description: 'Revoke sessions', isSystem: true },
    
    // Audit logs
    { name: 'read_audit_logs', resource: 'audit-log', action: 'read', description: 'View audit logs', isSystem: true }
  ];

  for (const permission of permissions) {
    try {
      await strapi.entityService.create('api::permission.permission', {
        data: permission
      });
      console.log(`Created permission: ${permission.name}`);
    } catch (error) {
      console.log(`Permission ${permission.name} already exists`);
    }
  }

  // Create super admin user
  const superAdminPassword = await bcrypt.hash('admin123', 10);
  
  try {
    const superAdminRole = await strapi.entityService.findOne('api::role.role', {
      filters: { name: 'Super Admin' }
    });

    const allPermissions = await strapi.entityService.findMany('api::permission.permission');

    const superAdmin = await strapi.entityService.create('api::pam-user.pam-user', {
      data: {
        username: 'admin',
        email: 'admin@belgomla.com',
        fullName: 'System Administrator',
        employeeId: 'ADMIN001',
        department: 'IT',
        position: 'System Administrator',
        accessLevel: 'super_admin',
        status: 'active',
        password: superAdminPassword,
        roles: [superAdminRole.id],
        permissions: allPermissions.map(p => p.id)
      }
    });
    console.log('Created super admin user: admin / admin123');
  } catch (error) {
    console.log('Super admin user already exists');
  }

  console.log('Seeding completed!');
}

module.exports = {
  seed
};
