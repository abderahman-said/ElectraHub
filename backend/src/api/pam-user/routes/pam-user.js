'use strict';

/**
 * pam-user router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::pam-user.pam-user', {
  config: {
    find: {
      middlewares: ['api::pam-user.auth'],
      policies: ['api::pam-user.has-permission'],
    },
    findOne: {
      middlewares: ['api::pam-user.auth'],
      policies: ['api::pam-user.has-permission'],
    },
    create: {
      middlewares: ['api::pam-user.auth'],
      policies: ['api::pam-user.has-permission'],
    },
    update: {
      middlewares: ['api::pam-user.auth'],
      policies: ['api::pam-user.has-permission'],
    },
    delete: {
      middlewares: ['api::pam-user.auth'],
      policies: ['api::pam-user.has-permission'],
    },
  },
});
