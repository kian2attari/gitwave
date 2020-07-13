const {createAppAuth} = require('@octokit/auth-app');
const {graphql} = require('@octokit/graphql');
const {githubAppJwt} = require('universal-github-app-jwt');
const axios = require('axios').default;

// Generates the JWT token needed to get the installation_id in init()
const jwt_token = async () => {
  const {token} = await githubAppJwt({
    id: process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY,
  });
  return token;
};

let graphqlWithAuth;

let has_init_run = false;

// Call github API endpoint to get installation_id for that specific installation
const init = async gh_variables => {
  const jwt_obj = await jwt_token();

  const response = await axios.get(
    `https://api.github.com/repos/${gh_variables.repo_owner}/${gh_variables.repo_name}/installation`,
    {
      headers: {
        authorization: `bearer ${jwt_obj}`,
        accept: 'application/vnd.github.machine-man-preview+json',
      },
    }
  );

  const installation_id = response.data.id;
  console.log('repo installation id: ', installation_id);

  const auth = createAppAuth({
    id: process.env.APP_ID,
    installationId: installation_id,
    privateKey: process.env.PRIVATE_KEY,
  });

  graphqlWithAuth = graphql.defaults({
    request: {
      hook: auth.hook,
    },
  });

  has_init_run = true;
};

const call_gh_graphql = async (query, variables) => {
  try {
    if (!has_init_run) {
      const init_variables = {
        repo_owner: variables.repo_owner,
        repo_name: variables.repo_name,
      };
      if (
        typeof init_variables.repo_owner === 'undefined' ||
        typeof init_variables.repo_name === 'undefined'
      ) {
        throw Error(
          'You must provide an object with a repo owner and repository value for the init(gh_variables) function!'
        );
      } else {
        await init(init_variables);
      }
    }
    const data = await graphqlWithAuth(query, variables);

    const response = JSON.stringify(data, undefined, 2);

    console.log(response);

    return data;
  } catch (error) {
    // REVIEW is there a better way to handle this?
    // TODO improve error handling
    console.error(error);
    if (Array.isArray(error.errors)) {
      // This covers higher-level more logical graphQL errors raised on gitHub's end
      return {
        error_type: 'GRAPHQL_HIGH_LEVEL',
        errors_list: error.errors,
      };
    }
    // This covers the more lower level errors such as HTTPError 500 etc
    return {error_type: 'GRAPHQL_LOW_LEVEL', ...error.name, ...error.message};
  }
};

module.exports = {
  call_gh_graphql,
};
