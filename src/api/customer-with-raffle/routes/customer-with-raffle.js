module.exports = {
  routes: [
    {
      method: "GET",
      path: "/customer-with-raffle/:id",
      handler: "customer-with-raffle.getEventCustomers",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/customer-with-raffle",
      handler: "customer-with-raffle.addCustomerRaffleTicket",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
