const accountSid = 'ACadaafe6d1b07ff4e8a4bd6eb95f435b6';
const authToken = '6eadca162dbdb2ef891ca200b6ff2a17';
const client = require('twilio')(accountSid, authToken);

// Build task actions that say something and listens for a repsonse.
helloWorldTaskActions = {
  actions: [
    { say: 'Hi there, I\'m your virtual assistant! How can I help you?' },
    { listen: true }
  ]
};

// Create the hello_world task
// Replace 'UAXXX...' with your Assistant's unique SID https://www.twilio.com/console/autopilot/list
client.autopilot.assistants('UA4ae49c7575e49809a54316a545cb5ea0')
  .tasks
  .create({
    uniqueName: 'hello-world',
    actions: helloWorldTaskActions,
  })
  .then(assistant => console.log(assistant.sid))
  .done();