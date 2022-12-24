'use strict';

/**
 * raffle service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::raffle.raffle');
