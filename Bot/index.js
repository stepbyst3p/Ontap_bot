const TelegramBot = require("node-telegram-bot-api");
const request = require("request");
const token = "470083296:AAHs92SFFcTcd2dPQZvfTvqv7_OVqkk85Ek";
const bot = new TelegramBot(token, { polling: true });
const emoji = require("node-emoji").emoji;
const _ = require("lodash");
const headers = {
  "User-Agent": "Super Agent/0.0.1",
  Connection: "keep-alive",
  "Content-Type": "application/x-www-form-urlencoded"
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

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

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
    request(optionsBars, function(error, response, body) {
      console.log(body);
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
      bot
        .sendMessage(chatId, "Ближайшие бары в радиусе 5 километров:", options)ж
        // .then(() => {
       
        // });
    });
  // } catch (err) {
  //   bot.sendMessage(
  //     chatId,
  //     "К сожалению, поблизости нет интересных баров",
  //     options
  //   );
  // }
  bot.on("message", answer => {
    request.post(
      "http://localhost:8000/beers",
      { form: { barTitle: answer.text } },
      function(error, response, body) {
        console.log(body);
        console.log(JSON.parse(body));
        const prettyBeerList = _.map(
          JSON.parse(body),
          (beer, title) => {
            console.log({ beer });
            return `▪️ ${beer.title}\nПивоварня: ${
              beer.brewery
            }\nСтиль: ${beer.style}\nАлкоголь: ${beer.alc}%`;
          }
        );
        console.log(prettyBeerList);
        bot.sendMessage(
          chatId,
          prettyBeerList.join("\n\n"),
          markDownOption
        );
      }
    );
  });
});
