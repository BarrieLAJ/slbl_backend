module.exports = {
  routes: [
    {
      method: "GET",
      path: "/raffle-winner/:id",
      handler: "raffle-winner.getRaffleWinner",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
