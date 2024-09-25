export const authConfig = {
    production: false,
    msalConfig: {
      auth: {
        clientId: '4e748aa3-5df7-4b0c-881b-4aedc5caf9d5',
        authority: 'https://login.microsoftonline.com/5b751804-232f-410d-bb2f-714e3bb466eb',
      },
    },
    apiConfig: {
      scopes: ['user.read'],
      uri: 'https://graph.microsoft.com/v1.0/me',
    },
  };