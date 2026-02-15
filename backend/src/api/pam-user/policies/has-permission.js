'use strict';

module.exports = (policyContext, { strapi }) => {
  const { user } = policyContext.state;
  const { method } = policyContext.request;
  const { path } = policyContext.request.route;
  
  if (!user) {
    return false;
  }
  
  // Super admin has access to everything
  if (user.accessLevel === 'super_admin') {
    return true;
  }
  
  // Map HTTP methods to actions
  const actionMap = {
    'GET': 'read',
    'POST': 'create',
    'PUT': 'update',
    'PATCH': 'update',
    'DELETE': 'delete'
  };
  
  const action = actionMap[method] || 'read';
  const resource = path.split('/')[1]; // Extract resource from path
  
  // Check if user has permission for this action on this resource
  return strapi.service('api::pam-user.pam-user').checkPermission(
    user.id, 
    resource, 
    action
  );
};
