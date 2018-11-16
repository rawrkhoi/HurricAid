const config = require('../config')
const express = require('express');
const app = express();
const port = process.env.port || 3000;

var twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var client = new twilio(config.config.accountSid, config.config.authToken);

app.use(express.static(__dirname + '/app'));

app.get('/', (req, res) => {
 res.send('done');
})

app.post('/test', (req, res) => {

})

app.get('/test', (req, res) => {
  client.messages.create({
    body: 'Greetings! The current time is: XXXXXX GFYBF2Y40TH1T7Y',
    to: '+12092104311',  // Text this number
    from: '+15043020292' // From a valid Twilio number
  })
  .then((message) => console.log(message.sid))
  .done();
}); 

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  console.log(res);
  // twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));