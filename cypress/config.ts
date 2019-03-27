export const config = {
  userName: 'testtest@gmail.com',
  passWords: 'Test!2345',
  auth0Config: {
    domain: 'miso-legal-dev.auth0.com',
    clientID: '0u96xRCrTxbr822AiAEOGugeyuZkOCVF',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:4200',
    audience: 'https://miso.legal/api',
    scope: 'openid email profile',
    realm: 'Username-Password-Authentication'
  },

}

export const routes = {
  dispute: {
    findDisputesByUser: 'api/qry/FindDisputesByUser',
    createDispute: 'api/cmd/CreateDispute',
    renameDispute: 'api/cmd/RenameDispute',
    deleteDispute: 'api/cmd/DeleteDispute'
  }
};
