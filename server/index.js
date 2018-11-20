const config = require('../config')
const express = require('express');
const http = require('http');
const port = process.env.port || 3000;
const db = require('../database'); 

var twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
var client = new twilio(config.config.accountSid, config.config.authToken);
const app = express();

app.use(express.static(`${__dirname}/../dist/emergency`));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/test', (req, res) => {
  // testing phone number insertion query
  db.addNewPhone('000-000-0000').then(() => console.log('number inserted'));
  res.end(); 
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
})

http.createServer(app).listen(port, () => console.log(`Express server listening on port ${port}!`));
