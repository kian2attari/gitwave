const {Messages} = require('../blocks');

// TODO: Get user's timezone and display the date/time with respect to it
/**
 * @param {{
 *   channel_id: string;
 *   title: string;
 *   body: string;
 *   url: string;
 *   creator: string;
 *   avatar_url: string;
 *   create_date: string;
 *   mentioned_slack_user: string;
 *   is_closed: boolean;
 * }} mention_event_data
 */
module.exports = async (app, mention_event_data) => {
  // TriageTeamData is imported within this function scope because it would otherwise conflict with the require in the webhooks
  // TODO fix this
  const {TriageTeamData} = require('../models');
  const {
    title,
    html_url,
    creator,
    content_create_date,
    mentioned_slack_user,
    requestor_login,
    is_closed,
    installation_id,
    review_requested,
  } = mention_event_data;
  await app.client.chat.postMessage({
    // Since there is no context we just use the original token
    token: process.env.SLACK_BOT_TOKEN,
    // Conditional on whether the message should go to channel or just to a user as a DM
    ...(is_closed
      ? {
          channel: await TriageTeamData.get_team_channel_id(installation_id),
          blocks: Messages.GithubMentionMessage(mention_event_data),
        }
      : {
          channel: mentioned_slack_user,
          blocks: Messages.GithubMentionMessage(
            Object.assign(mention_event_data, {
              mentioned_slack_user: `@${mentioned_slack_user}`,
            })
          ),
        }),
    // Just in case there is an issue loading the blocks.
    text: `${
      review_requested ? `${requestor_login} requested your review ->` : ''
    }<@${mentioned_slack_user}>! ${title} posted by ${creator} on ${content_create_date}. Link: ${html_url}`,
  });
};
