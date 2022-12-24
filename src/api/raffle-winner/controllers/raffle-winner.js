"use strict";

const getRadomItemTowin = (raffleTickets, items) => {
  const itemsToWin = getItemsToWin(raffleTickets, items);
  const randomIndex = Math.floor(Math.random() * itemsToWin.length);
  return itemsToWin[randomIndex];
};
const getRadomRaffleTicketWinner = (raffleTickets) => {
  const raffleTicketsToWin = getRaffleTicketsNotWon(raffleTickets);
  const randomIndex = Math.floor(Math.random() * raffleTicketsToWin.length);
  return raffleTicketsToWin[randomIndex];
};
const getRaffleTicketsNotWon = (raffleTickets) => {
  return raffleTickets.filter((raffle) => raffle.item_won === null);
};
const getRaffleTicketsWon = (raffleTickets) => {
  return raffleTickets.filter((raffle) => raffle.item_won !== null);
};
const getItemsToWin = (raffleTickets, items) => {
  return items.filter((item) => {
    return !getRaffleTicketsWon(raffleTickets).find(
      (raffle) => raffle.item_won.Title === item.Title
    );
  });
};

/**
 * A set of functions called "actions" for `raffle-winner`
 */

module.exports = {
  getRaffleWinner: async (ctx, next) => {
    try {
      const eventRaffles = await strapi.entityService.findMany(
        "api::event.event",
        {
          fields: [],
          filters: {
            id: {
              $eq: ctx.params.id,
            },
          },
          populate: {
            raffles: {
              populate: "item_won",
            },
            Items: {
              fields: ["*"],
              populate: {
                Image: true,
              },
            },
          },
        }
      );
      const { raffles, Items } = eventRaffles[0];
      const itemWon = getRadomItemTowin(raffles, Items);
      const raffleTickWinner = getRadomRaffleTicketWinner(raffles);
      const raffleTicketWon = await strapi.entityService.update(
        "api::raffle.raffle",
        raffleTickWinner.id,
        {
          populate: {
            item_won: {
              fields: ["*"],
              populate: {
                Image: true,
              },
            },
            customer: true,
            event: {
              populate: {
                Items: {
                  fields: ["*"],
                  populate: {
                    Image: true,
                  },
                },
                raffles: {
                  populate: {
                    item_won: {
                      populate: {
                        Image: {
                          fields: ["name", "url"],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          data: {
            item_won: {
              Title: itemWon.Title,
              Image: itemWon.Image.id,
            },
          },
        }
      );
      ctx.body = {
        data: {
          raffleTicketWinner: raffleTicketWon,
          itemsWon: getItemsToWin(
            raffleTicketWon.event.raffles,
            raffleTicketWon.event.Items
          ),
          raffleTicketWinners: getRaffleTicketsWon(
            raffleTicketWon.event.raffles
          ),
        },
      };
    } catch (err) {
      ctx.body = err;
    }
  },
};
