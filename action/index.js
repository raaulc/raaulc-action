const core = require('@actions/core');
const axios = require('axios');
async function getGitHubUserInfo() {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };
  try {
    const response = await axios.get('https://api.github.com/user', { headers });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch GitHub user info: ${error.message}`);
  }
}
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
  getGitHubUserInfo().then((userInfo) => {
    const profilePicUrl = userInfo.avatar_url;
    const payload = {
      username: 'rahul-action-bot',
      icon_url: profilePicUrl,
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
          ],
          footer: "Powered By rtCamp's GitHub Actions Library",
        },
      ],
    };
    axios.post(slackWebhook, payload);
    console.log('Slack notification sent successfully');
  }).catch((error) => {
    core.setFailed(`Failed to send Slack notification: ${error.message}`);
  });
} catch (error) {
  core.setFailed(`Failed to send Slack notification: ${error.message}`);
}
