const { config } = require('../config');
const client = require('twilio')(config.accountSid, config.authToken);


client.autopilot.assistants
  .create({
    friendlyName: 'Quickstart Assistant',
    uniqueName: 'quickstart-assistant'
  })
  .then(assistant => console.log(assistant.sid))
  .done();