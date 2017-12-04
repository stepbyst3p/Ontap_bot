const TelegramBot = require("node-telegram-bot-api");
const request = require("request");
const token = "460387748:AAG62Hlk3qCTKuY_KnZ-7CygPmp0V6-kmPQ";
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
// bot.on("text", msg => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(
//     chatId,
//     "Бот слишком пьян, чтобы разговаривать. Лучше отправьте геолокацию"
//   );
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
  request(optionsBars, function(error, response, body) {
    if (!error) {
      const bars = JSON.parse(body);
      console.log(bars);
      let options = {
        reply_markup: JSON.stringify({
          keyboard: _.map(bars, bar => {
            const button = [
              {
                text: bar.title,
                callback_data: bar.address
              }
            ];
            return button;
          })
        })
      };
      bot
        .sendMessage(chatId, "Ближайшие бары в радиусе 5 километров:", options)
        .then(() => {
          bot.once("message", answer => {
            request.post(
              "http://localhost:8000/beers",
              { form: { barTitle: answer.text } },
              function(error, response, body) {
                if (body === "empty") {
                  bot.sendMessage(
                    chatId,
                    "Этот бар пока не опубликовал список пива",
                    markDownOption
                  );
                } else {
                  const prettyBeerList = _.map(
                    JSON.parse(body),
                    (beer, title) => {
                      console.log({ beer });
                      return `${emoji.beer} ${beer.title}\nПивоварня: ${
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
              }
            );
          });
        });
    } else {
      console.log(error);
    }
  });
});
