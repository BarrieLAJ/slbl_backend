"use strict";

/**
 * A set of functions called "actions" for `analytics-data`
 */

module.exports = {
  getCustomerCount: async (ctx, next) => {
    try {
      const customers = await strapi.entityService.findMany(
        "api::customer.customer",
        {
          fields: ["*"],
        }
      );
      ctx.body = {
        customerCount: customers.length,
      };
    } catch (err) {
      ctx.body = err;
    }
  },
  getRaffleWinnersCount: async (ctx, next) => {
    try {
      const customerRaffleWinners = await strapi.entityService.findMany(
        "api::raffle.raffle",
        {
          fields: ["*"],
          populate: {
            item_won: {
              $not: null,
            },
          },
        }
      );
      ctx.body = {
        customerWinnersCount: customerRaffleWinners.length,
      };
    } catch (err) {
      ctx.body = err;
    }
  },
  getProductsSoldCount: async (ctx, next) => {
    try {
      const sales = await strapi.entityService.findMany("api::sale.sale", {
        fields: ["*"],
        populate: {
          products: {
            fields: [],
          },
        },
      });
      let productCount = 0;
      sales.forEach((sale) => {
        productCount += sale.products.length;
      });

      ctx.body = {
        productsSoldCount: productCount,
      };
    } catch (err) {
      ctx.body = err;
    }
  },
  getProductSoldCount: async (ctx, next) => {
    try {
      const allproductsSales = await strapi.entityService.findMany(
        "api::sale.sale",
        {
          fields: [],
          populate: {
            products: {
              fields: ["id"],
            },
          },
        }
      );
      const productSales = allproductsSales
        .map((sale) => sale.products)
        .filter((products) =>
          products.find((product) => product.id == ctx.params.id)
        );

      ctx.body = {
        productsSoldCount: productSales.length,
      };
    } catch (err) {
      ctx.body = err;
    }
  },
};
