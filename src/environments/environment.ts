// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const host = location.origin;

export const environment = {
  production: false,
  auth0Config: {
    clientID: (<any>window).AUTH_0_CLIENT_ID,
    domain: (<any>window).AUTH_0_DOMAIN,
    responseType: 'token id_token',
    audience: (<any>window).AUTH_0_API_AUDIENCE,
    redirectUri: `${host}/login-callback`,
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
