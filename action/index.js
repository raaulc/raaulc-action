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
12:28
---
12:28
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
    text: slackMessage,
    attachments: [
      {
        fields: [
          {
            title: 'Branch Name',
            value: branchName,
            short: true,
          },
          {
            title: 'Event',
            value: eventName,
            short: true,
          },
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
