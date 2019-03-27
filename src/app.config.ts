let PRE_VIEW_MODE = false;
const mode = localStorage.getItem('VIEW_MODE');
if (mode === 'Preview') {
  PRE_VIEW_MODE = true;
}

export const appConfig = {
  maxRetryAttempts: 3,
  patternEmail: '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
  '(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$',
  authentication: {
    authTokenKey: 'AUTHENTICATION_TOKEN'
  },
  redirection: {
    default: ''
  },
  routing: {
    default: '',
    auth: {
      loginCallback: 'login-callback'
    },
    documents: {
      root: 'documents'
    },
    disputes: {
      root: 'disputes'
    }
  },
  uploadLimit: 5,
  acceptFileTypeToUpload: ['pdf'],
  acceptFileTypeToUploadHtml: '.pdf',
  preViewMode: PRE_VIEW_MODE,
  getDataSilentTimer: 1000 * 60,
  topMinHeightIssueNotes: 100,
  maxHeightAutoIssueNotes: 200,
  bottomMinHeightIssueDetail: 60,

};
