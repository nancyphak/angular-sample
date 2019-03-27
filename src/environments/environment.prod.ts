export const environment = {
  production: true,
  auth0Config: {
    clientID: (<any>window).AUTH_0_CLIENT_ID,
    domain: (<any>window).AUTH_0_DOMAIN,
    responseType: 'token id_token',
    audience: (<any>window).AUTH_0_API_AUDIENCE,
    redirectUri: (<any>window).AUTH_0_REDIRECT_URI,
    scope: 'openid profile email',
    responseMode: 'fragment'
  },
  server: {
    host: (<any>window).API_HOST,
    apiBaseUrl: (<any>window).API_BASE_URL
  },
  appInsights: {
    instrumentationKey: (<any>window).APPLICATIONINSIGHTS_INSTRUMENTATIONKEY,
  },
};
