exports.CreateTriageTeamModal = (existingTeamData = null) => ({
  'callback_id': 'setup_triage_workflow_view',
  'private_metadata': JSON.stringify(existingTeamData),
  'title': {
    'type': 'plain_text',
    'text': existingTeamData ? 'Modify team setup' : 'Setup new team',
    'emoji': true,
  },
  'submit': {
    'type': 'plain_text',
    'text': 'Submit',
    'emoji': true,
  },
  'type': 'modal',
  'close': {
    'type': 'plain_text',
    'text': 'Cancel',
    'emoji': true,
  },
  'blocks': [
    {
      'type': 'section',
      'text': {
        'type': 'mrkdwn',
        'text':
          'GitWave needs to know the team members responsible for triaging. This is so relevant notifications can be forwarded to them.',
      },
    },
    {
      'type': 'divider',
    },
    {
      'type': 'input',
      'block_id': 'users_select_input',
      'element': {
        'type': 'multi_users_select',
        // Pre-select the teammates
        ...(existingTeamData && {'initial_users': existingTeamData.teamMembers}),
        'action_id': 'triage_users',
        'placeholder': {
          'type': 'plain_text',
          'text': 'Select users',
          'emoji': true,
        },
      },
      'label': {
        'type': 'plain_text',
        'text': 'Select the users directly responsible for triaging',
        'emoji': true,
      },
    },
    {
      'type': 'input',
      'block_id': 'discussion_channel_select_input',
      'element': {
        'type': 'channels_select',
        // Pre-select the discussion channel
        ...(existingTeamData && {
          'initial_channel': existingTeamData.teamInternalTriageChannelId,
        }),
        'action_id': 'discussion_channel',
        'placeholder': {
          'type': 'plain_text',
          'text': 'Browse existing channels',
          'emoji': true,
        },
      },
      'label': {
        'type': 'plain_text',
        'text': 'Select a channel for the triage team',
        'emoji': true,
      },
    },
    {
      'type': 'input',
      'block_id': 'triage_channel_select_input',
      'element': {
        'type': 'channels_select',
        // Pre-select the team channel
        ...(existingTeamData && {
          'initial_channel': existingTeamData.teamChannelId,
        }),
        'action_id': 'triage_channel',
        'placeholder': {
          'type': 'plain_text',
          'text': 'Browse existing channels',
          'emoji': true,
        },
      },
      'label': {
        'type': 'plain_text',
        'text': 'Select a channel for internal issues (ex. triage-sdk)',
        'emoji': true,
      },
    },
    ...(!existingTeamData
      ? [
          {
            'type': 'input',
            'block_id': 'github_org_input_block',
            'label': {
              'type': 'plain_text',
              'text': 'Assign the GitHub org for this team',
              'emoji': true,
            },
            'element': {
              'type': 'external_select',
              'min_query_length': 0,
              'placeholder': {
                'type': 'plain_text',
                'text': 'Select an Organization',
                'emoji': true,
              },
              'action_id': 'github_org_select_input',
            },
          },
        ]
      : []),
  ],
});
