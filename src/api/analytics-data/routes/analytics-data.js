module.exports = {
  routes: [
    {
      method: "GET",
      path: "/analytics-data/participants",
      handler: "analytics-data.getCustomerCount",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/analytics-data/raffleWinners",
      handler: "analytics-data.getRaffleWinnersCount",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/analytics-data/products-sold",
      handler: "analytics-data.getProductsSoldCount",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/analytics-data/product-sold/:id",
      handler: "analytics-data.getProductSoldCount",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
