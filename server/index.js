const config = require('../config')
const express = require('express');
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

app.post('/test', (req, res) => {
  let first = 'Ethan';
  db.sequelize.query(`INSERT INTO users (name_first) VALUES ('${first}')`);
  res.end();
}); 

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  let textObj = {};
  
  if (req.body.Body.slice(0, 7).toLowerCase() === 'options') {
    twiml.message("Text one of these commands: 'help@[address]', 'have@[address]', or 'need@[address]'");
    // they send a message back. we add to db and we send one back to them
  } else if (req.body.Body.replace("'", "").slice(0, 5).toLowerCase() === 'help@') {
    textObj.number = req.body.From.slice(1);
    textObj.address = req.body.Body.slice(5);
    console.log(textObj);
    twiml.message('SOS pin created. You may now send a brief message with details (optional).');
    // they send a message back. we add to db and we send one back to them
  } else if (req.body.Body.replace("'", "").slice(0, 5).toLowerCase() === 'have@') {
    textObj.number = req.body.From.slice(1);
    textObj.address = req.body.Body.slice(5);
    console.log(textObj);
    twiml.message('What would you like to offer? Text 1 for Food, 2 for Water, 3 for Shelter, 4 for Other');
    // we need to let them know that they need to remove things when they run OUT
  } else if (req.body.Body.replace("'", "").slice(0, 5).toLowerCase() === 'need@') {
    textObj.number = req.body.From.slice(1);
    textObj.address = req.body.Body.slice(5);
    console.log(textObj);
    twiml.message('What do you need? Text 1 for Food, 2 for Water, 3 for Shelter');
    // send back a message with 3 closest places who have that
  } else if (req.body.Body.replace("'", "").slice(0, 4).toLowerCase() === 'out@') {
    textObj.number = req.body.From.slice(1);
    textObj.address = req.body.Body.slice(5);
    console.log(textObj);
    twiml.message('What are you out of? Text 1 for Food, 2 for Water, 3 for Shelter, 4 for Other');
    // they let us know what they're out of and we remove from db
  } else {
    twiml.message("Error: We don\'t know what you\'re mean. Please enter 'help@[address]', 'have@[address]', or 'need@[address]'")
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
})

http.createServer(app).listen(port, () => console.log(`Express server listening on port ${port}!`));