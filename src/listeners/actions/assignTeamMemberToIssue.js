const {assignTeamMemberToIssueOrPR} = require('../../models');

function assignTeamMember(app) {
  app.action('assignable_team_members', async ({ack, body, context, client}) => {
    await ack();
    try {
      const actionBody = body.actions[0];

      const {selected_option: selectedOption} = actionBody;

      if (selectedOption === null) {
        return;
      }
      // Since the username is in the format <@UXXXXXXXXXX>, we get rid of the first 2 characters and the last character to get the slack user id
      const selectedUserId = selectedOption.text.text.slice(2, -1);

      console.log(': --------------------------------------------------------------');
      console.log('assignTeamMember -> selectedUserId', selectedUserId);
      console.log(': --------------------------------------------------------------');

      const {issueOrPrId} = JSON.parse(selectedOption.value);

      console.log(': --------------------------------------------');
      console.log('assignTeamMember -> issueOrPrId', issueOrPrId);
      console.log(': --------------------------------------------');

      await assignTeamMemberToIssueOrPR(selectedUserId, issueOrPrId);

      console.log('successfully assigned!');

      await client.chat.postMessage({
        token: context.botToken,
        channel: selectedUserId,
        text: `Hey <@${selectedUserId}>! <@${body.user.id}> just assigned you to: `,
      });
    } catch (error) {
      console.error(error);
    }
  });
}

exports.assignTeamMember = assignTeamMember;