import * as fromPeople from './people.reducer';
import { initialState, reducer } from './people.reducer';
import { RemovePerson, RemovePersonSuccess } from '../actions';

describe('PeopleReducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const actualResult = reducer(undefined, {} as any);

      expect(actualResult).toBe(initialState);
    });
  });

  describe('Delete Person', () => {
    const person = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      personId: '653ada50-acf5-4a52-a283-24b9c86325b1'
    };
    it('should set loading = true, error = null', () => {
      const action = new RemovePerson(person);
      const expectedResult = {
        ...initialState,
        loading: true,
        error: null,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);

    });
    it('should set loading = false, error = null when delete success', () => {
      const action = new RemovePersonSuccess();
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
      const result = fromPeople.getPeopleLoading({
        ...initialState,
        loading: true,
      });
      expect(result).toBe(true);
    });

    it('should return the error', () => {
      const result = fromPeople.getError({
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
