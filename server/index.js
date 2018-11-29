const config = require('../config')
const express = require('express');
const db = require('../models');
const session = require('express-session');
const fallback = require('express-history-api-fallback');
const http = require('http');
const port = process.env.port || 3000;
const twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const client = new twilio(config.config.accountSid, config.config.authToken);
const app = express();

app.use(express.static(`${__dirname}/../dist/browser`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat'
}))
app.use(bodyParser.json());

app.post('/addPin', (req, res) => {
  let { help, have, message, address, lat, lng, supply } = req.body.pin;
  db.pin.create({
    help: help,
    have: have,
    message: message,
    address: address, 
    latitude: lat,
    longitude: lng,
  }, (error) => {
    console.log('error creating pin: ', error);
    res.status(500).send(error);
  }).then(() => {
    db.pin.findOne({ where: { address: address }, raw:true }, 
      (error) => {
        console.log('error finding pin: ', error);
        res.status(500).send(error);
      }).then((pin) => {
      if (pin.have === true){
        supply.forEach((sup) => {
          db.supply_info.create({
            id_supply: sup,
            id_pin: pin.id,
          }, (error) => {
            console.log('error adding supply info: ', error);
            res.status(500).send(error);
          });
        });
      }
      console.log('pin created', pin);
      res.status(201).send(pin);
    }, (error) => {
      console.log('error finding pin: ', error);
      res.status(500).send(error);
    }); 
  }); 
}); 

app.get('/getPins', (req, res) => {
  db.pin.findAll().then((pins) => {
    res.status(200).send(pins);
  }, (error) => {
    console.log('error finding all pins: ', error);
    res.status(500).send(error);
  });
});

app.get('/getSupplies', (req, res) => {
  db.supply.findAll().then((supplies) => {
    res.status(200).send(supplies);
  }, (error) => {
    console.log('error finding all supplies: ', error);
    res.status(500).send(error);
  });
});

app.post('/signup', (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  db.credential.create({
    email: email,
    password: password,
  }, (error) => {
    console.log('error creating credential: ', error);
    res.status(500).send(error);
  }).then(() => {
    db.phone.create({
      number: phone
    }, (error) => {
      console.log('error creating phone: ', error);
      res.status(500).send(error);
    }).then(() => {
      db.phone.findOne({ where: { number: phone }, raw:true }, (error) => {
        console.log('error finding phone: ', error);
        res.status(500).send(error);
      }).then((ph) => {
        db.credential.findOne({ where: { email: email }, raw:true }, (error) => {
          console.log('error finding credential: ', error);
          res.status(500).send(error);
        }).then((cred) => {
          db.user.create({
            name_first: firstName,
            name_last: lastName,
            id_credential: cred.id,
            id_phone: ph.id,
          }, (error) => {
            console.log('error creating user: ', error);
            res.status(500).send(error);
          }).then(() => {
            db.user.findOne({ where: { id_credential: cred.id }, raw:true}, (error) => {
              console.log('error finding user: ', error);
              res.status(500).send(error);
            }).then((user) => {
              console.log('user created: ', user);
              res.status(201).send(user);
            });
          }); 
        });
      });
    }); 
  }); 
});

// for page refresh
app.use(fallback('index.html', {root: './dist/browser'}));

http.createServer(app).listen(port, () => console.log(`Express server listening on port ${port}!`));