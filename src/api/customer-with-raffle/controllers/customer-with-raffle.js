"use strict";

const generateRandomCode = (eventAlias = "", phoneNumber, lastId) => {
  const lastTowDigitsFromPhone = `${phoneNumber.at(-2)}${phoneNumber.at(-1)}`;
  let randomCode;
  if (lastId.split("").length > 1) {
    randomCode = `${eventAlias.toUpperCase()}${
      lastTowDigitsFromPhone[0]
    }${lastId}`;
  } else {
    randomCode = `${eventAlias.toUpperCase()}${lastTowDigitsFromPhone}${lastId}`;
  }
  return randomCode;
};

/**
 * A set of functions called "actions" for `customer-with-raffle`
 */

module.exports = {
  getEventCustomers: async (ctx, next) => {
    try {
      const eventRaffles = await strapi.entityService.findMany(
        "api::event.event",
        {
          fields: [],
          filters: {
            id: {
              $eq: ctx.request.params.id,
            },
          },
          populate: {
            raffles: {
              populate: {
                customer: {
                  fields: ["name", "email", "location", "phone"],
                },
              },
              fields: [],
            },
          },
        }
      );
      const raffles = eventRaffles.map((event) => {
        return event.raffles;
      });
      const customers = raffles[0].map((raffle) => {
        return raffle.customer;
      });
      ctx.body = {
        customers,
      };
    } catch (err) {
      ctx.body = err;
    }
  },
  addCustomerRaffleTicket: async (ctx, next) => {
    try {
      const lastId = await strapi.entityService.findMany("api::raffle.raffle", {
        fields: ["id"],
        sort: { id: "desc" },
      });
      const products = await strapi.entityService.findMany(
        "api::product.product",
        {
          fields: ["Price"],
          filters: {
            id: {
              $in: ctx.request.body.data.products,
            },
          },
        }
      );
      let productsTotal = 0;
      for (let product of products) {
        productsTotal += +product.Price;
      }
      let data = await strapi.entityService.findMany("api::customer.customer", {
        filters: {
          phone: {
            $eq: ctx.request.body.data.customer.phone,
          },
        },
      });
      // .findOne({ data: ctx.request.body.data.customer });
      data = data[0];
      if (!data) {
        data = await strapi
          .service("api::customer.customer")
          .create({ data: ctx.request.body.data.customer });
      }
      const event = await strapi
        .service("api::event.event")
        .findOne(ctx.request.body.data.eventId);
      const sale = await strapi.service("api::sale.sale").create({
        data: {
          products: ctx.request.body.data.products,
          customer: data.id,
          event: event.id,
          total_cost: `${productsTotal}`,
        },
      });
      const raffleData = await strapi.service("api::raffle.raffle").create({
        data: {
          raffle_titcket_code: generateRandomCode(
            event.alias,
            data.phone,
            `${lastId.length > 0 ? lastId[0].id : 0}`
          ),
          customer: data.id,
          event: event.id,
        },
      });
      const client = require("twilio")(
        "AC101ab37d18b3418141c15655cafe24b8",
        "8c375c94505f011c7272c6d544baaec9"
      );

      client.messages
        .create({
          body: `Your Raffle Tickt code is: ${raffleData.raffle_titcket_code}`,
          from: "+12058823749",
          to: data.phone,
        })
        .then((message) => console.log(message.sid));
      ctx.body = {
        customer: data,
        event,
        raffleData,
        sale,
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        err: error,
      };
    }
  },
};
