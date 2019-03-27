import * as fromEvidences from './evidences.reducer';
import { initialState, reducer } from './evidences.reducer';
import {
  CreateEvidence, CreateEvidenceFail, CreateEvidenceSuccess, DeleteEvidence, DeleteEvidenceSuccess,
  GetEvidencesByDispute, UpdateEvidence, UpdateEvidenceSuccess
} from '../actions';

describe('EvidenceReducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const actualResult = reducer(undefined, {} as any);

      expect(actualResult).toBe(initialState);
    });
  });

  describe('Get Evidence By Dispute', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const expectedResult = {
      ...initialState,
      loading: true,
      error: null
    };
    it('should set the true value to the loading, null value to the error', () => {
      const action = new GetEvidencesByDispute({ disputeId: disputeId });
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Get Evidence By Dispute Fail', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const expectedResult = {
      ...initialState,
      loading: true,
      error: null
    };
    it('should set the true value to the loading, null value to the error', () => {
      const action = new GetEvidencesByDispute({ disputeId: disputeId });
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Create Evidence', () => {
    const evidenceModel = {
      EvidenceId: '4884d580-fe80-4e22-994b-cf4e1f4d48e4',
      Text: '   Some text  ',
      PageNumber: 5,
      DocumentId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      IssueIds: [],
      DisputeId: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36'
    };
    const createAction = new CreateEvidence(evidenceModel);

    it('should should add evidence in the payload and trim the text', () => {
      const expectedResult = {
        ...initialState,
        loading: true,
        error: null,
        ids: ['4884d580-fe80-4e22-994b-cf4e1f4d48e4'],
        entities: {
          '4884d580-fe80-4e22-994b-cf4e1f4d48e4': {
            id: evidenceModel.EvidenceId,
            text: evidenceModel.Text.trim(),
            issueIds: evidenceModel.IssueIds,
            pageNumber: evidenceModel.PageNumber,
            documentId: evidenceModel.DocumentId,
            disputeId: evidenceModel.DisputeId,
            index: 0
          }
        },
      };
      const result = reducer(initialState, createAction);

      expect(result).toEqual(expectedResult);
    });

    it('should reset loading and error when create success', () => {
      const action = new CreateEvidenceSuccess({});
      const expectedResult = { ...initialState, loading: false, error: null };
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });

    it('should return error when create fail', () => {
      const action = new CreateEvidenceFail({ failedAction: createAction });
      const expectedResult = {
        ...initialState, loading: false, error: { message: fromEvidences.errorMessage, failedAction: createAction }
      };

      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });

  });

  describe('Update Evidence', () => {

    const evidence = {
      id: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      text: '   updated text   ',
      pageNumber: 123,
      documentId: '4884d580-fe80-4e22-994b-cf4e1f4d48e4',
      issueIds: [],
      issues: [],
      disputeId: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36',
      index: 123,
    };
    it('should return the update evidence', () => {
      const evidenceModel = {
        EvidenceId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
        Text: '   Some text  ',
        PageNumber: 5,
        DocumentId: '4884d580-fe80-4e22-994b-cf4e1f4d48e4',
        IssueIds: [],
        DisputeId: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36'
      };
      const createAction = new CreateEvidence(evidenceModel);
      const action = new UpdateEvidence(evidence);
      const expectedResult = {
        ...initialState,
        loading: true,
        error: null,
        ids: ['ad9dccbf-46df-4328-89bd-b8ac4057066c'],
        entities: {
          'ad9dccbf-46df-4328-89bd-b8ac4057066c': {
            id: evidence.id,
            text: evidence.text.trim(),
            issueIds: evidence.issueIds,
            pageNumber: evidence.pageNumber,
            documentId: evidence.documentId,
            disputeId: evidence.disputeId,
            issues: evidence.issues,
            index: evidence.index
          }
        }
      };

      const result = reducer(reducer(initialState, createAction), action);

      expect(result).toEqual(expectedResult);
    });
    it('should return the update evidence Success', () => {
      const action = new UpdateEvidenceSuccess('text');
      const expectedResult = {
        ...initialState,
        loading: false,
        error: null,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);

    });

  });

  describe('Delete Evidence', () => {
    const evidence = {
      evidenceId: '',
      id: '',
      text: '',
      pageNumber: null,
      documentId: '',
      issueIds: [],
      issues: [],
      disputeId: '',
      index: null,
    };
    it('should return the delete evidence', () => {
      const action = new DeleteEvidence(evidence);
      const expectedResult = {
        ...initialState,
        loading: true,
        error: null,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);

    });
    it('should return the delete evidence Success', () => {
      const action = new DeleteEvidenceSuccess('text');
      const expectedResult = {
        ...initialState,
        loading: false,
        error: null,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);

    });

  });

  describe('Selectors', () => {
    it('should return the loading status', () => {
      const result = fromEvidences.getLoading({
        ...initialState,
        loading: true,
      });
      expect(result).toBe(true);
    });

    it('should return the error', () => {
      const result = fromEvidences.getError({
        ...initialState,
        error: {
          message: 'Sorry, some thing is wrong...',
          failedAction: {} as any
        }
      });

      expect(result).toBeTruthy();
    });

  });

});
