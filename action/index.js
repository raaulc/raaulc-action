const core = require('@actions/core');
const axios = require('axios');

try {
  const slackWebhook = process.env.SLACK_WEBHOOK;
  const slackMessage = process.env.SLACK_MESSAGE;

  const payload = {
    text: slackMessage,
  };

  axios.post(slackWebhook, payload);

  console.log('Slack notification sent successfully');
} catch (error) {
  core.setFailed(`Failed to send Slack notification: ${error.message}`);
}