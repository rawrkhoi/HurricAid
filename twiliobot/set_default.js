const { config } = require('../config');
const client = require('twilio')(config.accountSid, config.authToken);


client.autopilot.assistants(config.assistant)
  .defaults()
  .update({
    defaults: {
      defaults: {
        assistant_initiation: 'task://twiliobot/test-bot',
        fallback: 'task://twiliobot/test-bot'
      }
    }
  })
  .then(defaults => console.log(defaults.assistantSid))
  .done();