name: slack-notification
on:
  push:
    branches:
      - main
jobs:
  slack-notification:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Get Author Information
        id: author-info
        run: |
          echo "::set-env name=COMMIT_AUTHOR::$(git show -s --format='%an')"
          echo "::set-env name=COMMIT_EMAIL::$(git show -s --format='%ae')"
          echo "::set-env name=COMMIT_MESSAGE::$(git show -s --format='%s')"
          echo "::set-env name=COMMIT_EVENT::${{ github.event_name }}"
          echo "::set-env name=COMMIT_ID::${{ github.sha }}"
          echo "::set-env name=COMMIT_AVATAR_URL::$(curl -s -H 'Authorization: token ${{ secrets.GITHUB_TOKEN }}' https://api.github.com/users/$(git show -s --format='%an') | jq -r '.avatar_url')"
      - name: Post to Slack
        run: |
          export SLACK_WEBHOOK=${{ secrets.SLACK_WEBHOOK }}
          export SLACK_MESSAGE="Author: $COMMIT_AUTHOR\nBranch: ${{ github.ref }}\nCommit Message: $COMMIT_MESSAGE\nEvent: $COMMIT_EVENT\nCommit ID: $COMMIT_ID"
          curl -X POST -H 'Content-type: application/json' --data "{\"text\": \"${SLACK_MESSAGE}\", \"attachments\": [{\"image_url\":\"$COMMIT_AVATAR_URL\"}]}" ${SLACK_WEBHOOK}
12:56
-----------------
12:56
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
            {
              title: 'Message',
              value: slackMessage,
              short: false,
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
