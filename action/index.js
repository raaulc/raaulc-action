const core = require('@actions/core');
const axios = require('axios');
try {
  const slackWebhook = process.env.SLACK_WEBHOOK;
  const slackMessage = process.env.SLACK_MESSAGE;
  const authorName = process.env.GITHUB_ACTOR;
  const commitId = process.env.GITHUB_SHA;
  const commitMsg = process.env.GITHUB_EVENT_PATH
    ? require(process.env.GITHUB_EVENT_PATH).head_commit.message
    : '';
  const githubRepo = process.env.GITHUB_REPOSITORY;
  const githubRunId = process.env.GITHUB_RUN_ID;
  const githubActionUrl = `https://github.com/${githubRepo}/actions/runs/${githubRunId}`;
  const githubCommitUrl = `https://github.com/${githubRepo}/commit/${commitId}`;
  const payload = {
    text: slackMessage,
    attachments: [
      {
        author_name: authorName,
        fields: [
          {
            title: 'Commit ID',
            value: `<${githubCommitUrl}|${commitId}>`,
            short: true,
          },
          {
            title: 'Commit Message',
            value: commitMsg,
            short: true,
          },
          {
            title: 'Actions URL',
            value: `<${githubActionUrl}|${process.env.GITHUB_WORKFLOW}>`,
            short: true,
          },
        ],
      },
    ],
  };
  axios.post(slackWebhook, payload);
  console.log('Slack notification sent successfully');
} catch (error) {
  core.setFailed(`Failed to send Slack notification: ${error.message}`);
}
