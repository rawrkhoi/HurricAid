const config = require('../config')
const express = require('express');
const fallback = require('express-history-api-fallback');
const http = require('http');
const port = process.env.port || 3000;
const db = require('../models');
const twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const client = new twilio(config.config.accountSid, config.config.authToken);
const app = express();

app.use(express.static(`${__dirname}/../dist/browser`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/helpPin', (req, res) => {
  let { message, address, lat, lng } = req.body.pin;
  db.sequelize.query(`INSERT INTO help_pins (message, address, latitude, longitude) VALUES ('${message}', '${address}', '${lat}', '${lng}')`).then(() => {
    res.end(); 
  });
}); 

app.get('/getHelpPins', (req, res) => {
  db.sequelize.query(`SELECT * FROM help_pins`).then(([pins]) => {
    res.send(pins);
  });
});

app.post('/havePin', (req, res) => {
  let { address, lat, lng, food, water, shelter, other } = req.body.pin;
  db.sequelize.query(`INSERT INTO have_pins (address, latitude, longitude, food, water, shelter, other) VALUES ('${address}', '${lat}', '${lng}', '${food}', '${water}','${shelter}','${other}')`).then(() => {
    res.end(); 
  });
}); 

app.get('/getHavePins', (req, res) => {
  db.sequelize.query(`SELECT * FROM have_pins`).then(([pins]) => {
    res.send(pins);
  });
});

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  
  if (req.body.Body.toLowerCase() === 'help@') {
    twiml.message('What can we help you with?');
  } else if (req.body.Body.toLowerCase() === 'have@') {
    twiml.message('What do you have? Text 1 for Food, 2 for Water, 3 for Shelter, 4 for Other');
  } else {
    twiml.message("Error: We don\'t know what you\'re trying to say.")
  }
  
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.use(fallback('index.html', {root: './dist/browser'}));

http.createServer(app).listen(port, () => console.log(`Express server listening on port ${port}!`));