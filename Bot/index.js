const TelegramBot = require("node-telegram-bot-api");
const request = require("request");
const token = "470083296:AAHs92SFFcTcd2dPQZvfTvqv7_OVqkk85Ek";
const bot = new TelegramBot(token, { polling: true, workers: 2 });
const _ = require("lodash");
const BOTAN_TOKEN = "14f88622-ef15-4067-bccc-caa7cd1629fb";
const botan = require("botanio")(BOTAN_TOKEN);

const headers = {
  "User-Agent": "Super Agent/0.0.1",
  Connection: "keep-alive",
  "Content-Type": "application/x-www-form-urlencoded"
};

var startNotifications = function (message) {
  botan.track(message, "Start");
  var uid = msg.chat.id;
};
const optionsBeers = {
  url: "http://localhost:8000/beers",
  method: "POST",
  headers: headers,
  form: { barTitle: "" },
  agent: false,
  pool: { maxSockets: 100 }
};

const markDownOption = {
  parse_mod: "markdown"
};
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const resp = match[1];

//   bot.sendMessage(chatId, resp);
// });

bot.on("location", msg => {
  const chatId = msg.chat.id;

  const optionsBars = {
    url: "http://localhost:8000/bars",
    method: "POST",
    headers: headers,
    form: { lat: msg.location.latitude, lng: msg.location.longitude },
    agent: false,
    pool: { maxSockets: 100 }
  };
  console.log(msg.location);
  // try {
  request(optionsBars, function (error, response, body) {
    const bars = JSON.parse(body);
    let options = {
      reply_markup: JSON.stringify({
        keyboard: _.map(bars, bar => {
          const button = [
            {
              text: bar.title,
              callback_data: bar.address
            }
          ];
          console.log(button);
          return button;
        })
      })
    };
    bot.sendMessage(
      chatId,
      "Вот ближайшие места из тех, которые я знаю",
      options
    );
    // .then(() => {
    //   bot.on("text", answer => {
    //     const chatId = answer.chat.id;
    //     request.post(
    //       "http://localhost:8000/beers",
    //       { form: { barTitle: answer.text } },
    //       function(error, response, body) {
    //         if (body === "not_exist") {
    //           // bot.sendMessage(
    //           //   chatId,
    //           //   "Вероятно, вы пытаетесь найти несуществующий бар, либо его нет поблизости",
    //           //   markDownOption
    //           // );
    //           console.log("kto-to chtoto napisal");
    //         } else {
    //           const prettyBeerList = _.map(
    //             JSON.parse(body),
    //             (beer, title) => {
    //               console.log({ beer });
    //               return `▪️ ${beer.title}\nПивоварня: ${
    //                 beer.brewery
    //               }\nСтиль: ${beer.style}\nАлкоголь: ${beer.alc}%`;
    //             }
    //           );
    //           console.log(prettyBeerList);
    //           bot.sendMessage(chatId, `${answer.text} tap list`);
    //           bot.sendMessage(
    //             chatId,
    //             prettyBeerList.join("\n\n"),
    //             markDownOption
    //           );
    //         }
    //       }
    //     );
    //   });
    // });
  });
  // bot.on("text", answer => {
  //   request.post(
  //     "http://localhost:8000/beers",
  //     { form: { barTitle: answer.text } },
  //     function(error, response, body) {
  //       if (body === "not_exist") {
  //         // bot.sendMessage(
  //         //   chatId,
  //         //   "Вероятно, вы пытаетесь найти несуществующий бар, либо его нет поблизости",
  //         //   markDownOption
  //         // );
  //         console.log("kto-to chtoto napisal");
  //       } else {
  //         const prettyBeerList = _.map(JSON.parse(body), (beer, title) => {
  //           console.log({ beer });
  //           return `▪️ ${beer.title}\nПивоварня: ${beer.brewery}\nСтиль: ${
  //             beer.style
  //           }\nАлкоголь: ${beer.alc}%`;
  //         });
  //         console.log(prettyBeerList);
  //         bot.sendMessage(chatId, prettyBeerList.join("\n\n"), markDownOption);
  //       }
  //     }
  //   );
  // });
  // } catch (err) {
  //   bot.sendMessage(
  //     chatId,
  //     "К сожалению, поблизости нет интересных баров",
  //     options
  //   );
  // }
});
bot.on("text", answer => {
  const chatId = answer.chat.id;
  request.post(
    "http://localhost:8000/beers",
    { form: { barTitle: answer.text } },
    function (error, response, body) {
      if (body === "not_exist") {
        // bot.sendMessage(
        //   chatId,
        //   "Вероятно, вы пытаетесь найти несуществующий бар, либо его нет поблизости",
        //   markDownOption
        // );
        console.log("kto-to chtoto napisal");
      } else {
        const prettyBeerList = _.map(JSON.parse(body), (beer, title) => {
          console.log({ beer });
          return `▪️ ${beer.title}\nПивоварня: ${beer.brewery}\nСтиль: ${
            beer.style
            }\nАлкоголь: ${beer.alc}%`;
        });
        console.log(prettyBeerList);
        bot.sendMessage(chatId, `${answer.text} tap list`).then(() => {
          bot.sendMessage(chatId, prettyBeerList.join("\n\n"), optionsBeers);
        });
      }
    }
  );
});