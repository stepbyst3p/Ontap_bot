const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const db = require("./config/db");
const distance = require("gps-distance");
const cors = require("cors");
const app = express();
const _ = require("lodash");
const geolib = require("geolib");
const nodemailer = require("nodemailer");
app.use(cors());
// const firebase = require("./config/firebase");
const admin = require("firebase-admin");
const serviceAccount = require("./config/firebase_key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://beerbot-91a90.firebaseio.com"
});
const fb = admin.database();
const ref = fb.ref("/users");

const port = 8000;
app.listen(port, () => {
  console.log("We are live on " + port);
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/registration", (req, res) => {
  console.log(req);
  const {
    email = "",
    name = "",
    barTitle = "",
    barCity = "",
    barAddress = ""
  } = req.body;

  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: "lttasap",
        pass: "fck1ng00dp45"
      }
    });

    let mailOptions = {
      from: `${barTitle} "🍺" <lttasap@yandex.ru>`,
      to: "spikerdn@gmail.com, info@ontap.online",
      subject: "Новая заявка ✔",
      text: "Hello world?",
      html: `<b>Имя: </b>${name}<br/><b>Email: </b>${email}<br/><b>Название: </b>${barTitle}<br/><b>Город: </b>${barCity}<br/><b>Адрес: </b>${barAddress}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      res.send("success");
    });
  });
});

app.post("/bars", (req, res) => {
  console.log(req.body);
  try {
    const geo = {
      latitude: req.body.lat,
      longitude: req.body.lng
    };
    ref.once("value", function(snapshot) {
      const Data = snapshot.val();

      const obj = Object.values(Data).map(x => x.bars);
      const barsCollection = Object.values(obj).map(x => {
        let bors = Object.values(x).map(bar => ({
          [bar.address]: bar.geocode
        }));
        return bors;
      });
      let result = barsCollection.map(a => a.geocode);
      let resultishe = [].concat.apply([], barsCollection);
      let geocodes = resultishe.reduce(function(acc, x) {
        for (var key in x) acc[key] = x[key];
        return acc;
      }, {});

      const sortedGeocodes = geolib.orderByDistance(geo, geocodes, 500);

      const bars = Object.values(obj).map(x => {
        let bors = Object.values(x).map(bar => ({
          title: bar.title,
          address: bar.address,
          geocode: bar.geocode,
          beers: bar.beers
        }));
        return bors;
      });
      let qwe = [].concat.apply([], bars);
      let barList = qwe.slice(0, 5);
      res.send(barList);

      // let meow = {
      //   result1: _.find(qwe, { address: sortedGeocodes[0].key }),
      //   result2: _.find(qwe, { address: sortedGeocodes[1].key }),
      //   result3: _.find(qwe, { address: sortedGeocodes[2].key }),
      //   result4: _.find(qwe, { address: sortedGeocodes[3].key }),
      //   result5: _.find(qwe, { address: sortedGeocodes[4].key })
      // };
      // let pew = {
      //   result: qwe.slice(1, 5)
      // }
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app
  .post("/beers", (req, res) => {
    const barTitle = req.body.barTitle;
    console.log(barTitle);
    ref.once("value", function(snapshot) {
      const Data = snapshot.val();
      console.log(Data);
      // if (Data.length === 0 || typeOf(Data))
      const obj = Object.values(Data).map(x => x.bars);
      const barsCollection = Object.values(obj).map(x => {
        let bors = Object.values(x).map(bar => ({
          title: bar.title,
          beers: bar.beers
        }));
        return bors;
      });
      let qwe = [].concat.apply([], barsCollection);
      const thisBar = _.find(qwe, { title: barTitle });
      if (typeof thisBar !== "undefined") {
        const beerList = _.map(thisBar.beers, beer => ({
          title: beer.beerTitle,
          brewery: beer.beerBrewery,
          style: beer.beerStyle,
          alc: beer.beerAlc
        }));
        res.send(beerList);
      } else {
        res.send("not_exist");
      }
    });
  })
  .on("error", function(err) {
    res.send(err);
  });
