export const authConfig = {
    production: false,
    msalConfig: {
      auth: {
        clientId: '67032d8f-1308-4b68-bac8-0359ed25a24a',
        authority: 'https://login.microsoftonline.com/5b751804-232f-410d-bb2f-714e3bb466eb',
      },
    },
    apiConfig: {
      scopes: ['user.read'],
      uri: 'https://graph.microsoft.com/v1.0/me',
    },
  };