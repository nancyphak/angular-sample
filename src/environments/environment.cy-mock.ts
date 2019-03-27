// The file contents for the current environment will overwrite these during test.

export const environment = {
  production: false,
  auth0Config: {
    clientID: '0u96xRCrTxbr822Ai............',
    domain: 'dev.auth0.com',
    responseType: 'token id_token',
    audience: 'https://dev.com/api',
    redirectUri: 'http://localhost:4200/login-callback',
    scope: 'openid profile email',
    responseMode: 'fragment'
  },
  server: {
    host: 'http://localhost:7071',
    apiBaseUrl: 'api'
  },
  appInsights: {
    instrumentationKey: '65cb8187-13f1-4234-8e71-..........',
  },
};
