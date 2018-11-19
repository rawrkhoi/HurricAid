const { config } = require('../config');
const client = require('twilio')(config.accountSid, config.authToken);


// Build task actions that say something and listens for a repsonse.
testBotTaskActions = {
  actions: [
    { say: 'HELLO PLEASE SAY SOMETHING DIFFERENT!' },
    { listen: true }
  ]
};

// Create the hello_world task
// Replace 'UAXXX...' with your Assistant's unique SID https://www.twilio.com/console/autopilot/list
client.autopilot.assistants(config.assistant)
  .tasks
  .create({
    uniqueName: 'test-bot',
    actions: testBotTaskActions,
  })
  .then(assistant => console.log(assistant.sid))
  .done();