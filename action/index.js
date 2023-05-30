const core = require('@actions/core');
const axios = require('axios');
try {
  const slackWebhook = process.env.SLACK_WEBHOOK;
  const slackMessage = process.env.SLACK_MESSAGE;
  const authorName = process.env.GITHUB_ACTOR;
  const commitRef = process.env.GITHUB_REF;
  const commitEvent = process.env.GITHUB_EVENT_NAME;
  const actionsUrl = process.env.GITHUB_WORKFLOW;
  const commitId = process.env.GITHUB_SHA;
  const commitMsg = process.env.GITHUB_EVENT_PATH
    ? require(process.env.GITHUB_EVENT_PATH).head_commit.message
    : '';
  const payload = {
    text: slackMessage,
    attachments: [
      {
        author_name: authorName,
        fields: [
          {
            title: 'Ref',
            value: commitRef,
            short: true,
          },
          {
            title: 'Event',
            value: commitEvent,
            short: true,
          },
          {
            title: 'Actions URL',
            value: actionsUrl,
            short: false,
          },
          {
            title: 'Commit',
            value: commitId,
            short: true,
          },
          {
            title: 'Message',
            value: commitMsg,
            short: true,
          },
        ],
        footer: 'Powered By rtCamp\'s GitHub Actions Library',
      },
    ],
  };
  axios.post(slackWebhook, payload);
  console.log('Slack notification sent successfully');
} catch (error) {
  core.setFailed(`Failed to send Slack notification: ${error.message}`);
}
