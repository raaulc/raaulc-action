const path = require('path');
const core = require('@actions/core');
const axios = require('axios');
async function run() {
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
    const logoPath = path.join(__dirname, '../logo.png'); // Adjust the path based on the actual location of the logo
    // Determine build status
    const buildStatus = core.getInput('build_status');
    core.setOutput('build_status', buildStatus);
    const payload = {
      username: 'rahul-action-bot',
      icon_url: `file://${logoPath}`, // Use the logoPath variable to specify the custom photo
      attachments: [
        {
          color: buildStatus === 'success' ? 'good' : 'danger',
          author_name: authorName,
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
            {
              title: 'Build Status',
              value: buildStatus === 'success' ? 'Passed' : 'Failed',
              short: true,
            },
          ],
          footer: "Powered By raaulc's GitHub Actions Library",
        },
      ],
    };
    await axios.post(slackWebhook, payload);
    console.log('Slack notification sent successfully');
  } catch (error) {
    core.setFailed(`Failed to send Slack notification: ${error.message}`);
  }
}
run();
