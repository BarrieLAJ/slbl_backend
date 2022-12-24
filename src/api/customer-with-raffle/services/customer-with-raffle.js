"use strict";

/**
 * customer-with-raffle service
 */

module.exports = () => ({
  getCustomerWithRaffle: async (event_id) => {
    try {
      // fetching data
      const entries = await strapi.entityService.findMany(
        "api::raffle.raffle",
        {
          fields: ["id", "title", "slug", "createdAt"],
          populate: {
            customer: {
              fields: ["name", "email", "phone"],
            },
          },
        }
      );
      return entries;
    } catch (err) {}
  },
});
