import * as fromShares from './shares.reducer';
import { initialState, reducer } from './shares.reducer';
import * as fromSharesActions from '../actions/shares.action';
import * as fromPleadings from './pleadings.reducer';

describe('ShareReducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const actualResult = reducer(undefined, {} as any);

      expect(actualResult).toBe(initialState);
    });
  });

  describe('Load Shares By Dispute', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const expectedResult = {
      ...initialState,
      loading: true,
      error: null
    };
    it('should set the true value to the loading, null value to the error', () => {
      const action = new fromSharesActions.LoadShares(disputeId);
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Load Shares By Dispute Fail', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const removeAction = new fromSharesActions.LoadShares(disputeId);
    it('should set the true value to the loading, null value to the error', () => {
      const action = new fromSharesActions.LoadSharesFail({failedAction: removeAction});
      const expectedResult = {
        ...initialState,
        loading: false,
        error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Create ShareDisputeModel', () => {
    const shareModel = {
      id: '27f11786-a3f0-4328-9f6a-88c762db7b32',
      disputeId: '27f11786-a3f0-4328-9f6a-88c762db7b32',
      email: 'foo1@bar.com',
      status: 'PENDING'
    };
    const createAction = new fromSharesActions.CreateShare(shareModel);

    it('should should add email in the payload and trim the text', () => {
      const expectedResult = {
        ...initialState,
        loading: true,
        error: null,
        ids: ['27f11786-a3f0-4328-9f6a-88c762db7b32'],
        entities: {
          '27f11786-a3f0-4328-9f6a-88c762db7b32': {
            id: shareModel.id,
            disputeId: shareModel.disputeId,
            email: shareModel.email,
            status: shareModel.status
          }
        },
      };
      const result = reducer(initialState, createAction);

      expect(result).toEqual(expectedResult);
    });

    it('should reset loading and error when create success', () => {
      const action = new fromSharesActions.CreateShareSuccess({});
      const expectedResult = {...initialState, loading: false, error: null};
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });

    it('should return error when create fail', () => {
      const action = new fromSharesActions.CreateShareFail({failedAction: createAction});
      const expectedResult = {
        ...initialState, loading: false, error: {message: fromShares.errorMessage, failedAction: createAction}
      };

      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Delete ShareDisputeModel', () => {
    const share = {
      id: '',
      disputeId: '',
      email: '',
      status: '',
    };
    it('should return the delete evidence', () => {
      const action = new fromSharesActions.RemoveShare(share);
      const expectedResult = {
        ...initialState,
        loading: true,
        error: null,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);

    });
    it('should return the delete evidence Success', () => {
      const action = new fromSharesActions.RemoveShareSuccess('text');
      const expectedResult = {
        ...initialState,
        loading: false,
        error: null,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);

    });

  });
});

