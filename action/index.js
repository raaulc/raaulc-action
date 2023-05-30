const core = require('@actions/core');
const axios = require('axios');
try {
  const slackWebhook = process.env.SLACK_WEBHOOK;
  const slackMessage = process.env.SLACK_MESSAGE;
  const authorName = process.env.GITHUB_ACTOR;
  const commitId = process.env.GITHUB_SHA.slice(0, 4); // Shorten commit ID to 4 digits
  const commitMsg = process.env.GITHUB_EVENT_PATH
    ? require(process.env.GITHUB_EVENT_PATH).head_commit.message
    : '';
  const branchName = process.env.GITHUB_REF.split('/').slice(2).join('/'); // Extract branch name from GITHUB_REF
  const eventName = process.env.GITHUB_EVENT_NAME;
  const githubRepo = process.env.GITHUB_REPOSITORY;
  const githubRunId = process.env.GITHUB_RUN_ID;
  const githubActionUrl = `https://github.com/${githubRepo}/actions/runs/${githubRunId}`;
  const githubCommitUrl = `https://github.com/${githubRepo}/commit/${process.env.GITHUB_SHA}`;
  const payload = {
    username: 'rahul-action-bot',
    icon_url: 'https://example.com/user-photo.png', // Replace with the actual user photo URL
    attachments: [
      {
        color: 'good', // Use 'good' for green color
        author_name: 'raaulc',
        fields: [
          {
            title: 'Ref',
            value: `refs/heads/${branchName}`,
            short: true,
          },
          {
            title: 'Event',
            value: eventName,
            short: true,
          },
          {
            title: 'Actions URL',
            value: `<${githubActionUrl}|ci-pipeline>`,
            short: true,
          },
          {
            title: 'Commit',
            value: `<${githubCommitUrl}|${commitId}>`,
            short: true,
          },
          {
            title: 'Message',
            value: slackMessage,
            short: false,
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
