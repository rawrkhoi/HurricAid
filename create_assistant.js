const accountSid = 'ACadaafe6d1b07ff4e8a4bd6eb95f435b6';
const authToken = '6eadca162dbdb2ef891ca200b6ff2a17';
const client = require('twilio')(accountSid, authToken);

client.autopilot.assistants
  .create({
    friendlyName: 'Quickstart Assistant',
    uniqueName: 'quickstart-assistant'
  })
  .then(assistant => console.log(assistant.sid))
  .done();