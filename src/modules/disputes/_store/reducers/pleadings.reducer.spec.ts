import * as fromPleadings from './pleadings.reducer';
import { initialState, reducer } from './pleadings.reducer';
import { Pleading } from '../../models';
import * as fromAction from '../actions/pleadings.action';

describe('PleadingsReducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const actualResult = reducer(undefined, {} as any);

      expect(actualResult).toBe(initialState);
    });
  });
  describe('Get Pleading By Dispute', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const pleading = [{
      id: '653ada50-acf5-4a52-a283-24b9c8632511',
      disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
      title: 'some text',
      responses: [],
      sentences: []
    }];
    const removeAction = new fromAction.LoadParagraphs({disputeId});
    it('should set the true value to the loading, null value to the error', () => {
      const expectedResult = {
        ...initialState,
        loading: true,
        error: null
      };
      const action = new fromAction.LoadParagraphs({disputeId});
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
    it('should return error when create fail', () => {
      const action = new fromAction.LoadParagraphsFail({failedAction: removeAction});
      const expectedResult = {
        ...initialState, loading: false, error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
    // it('should set the true value to the loading, null value to the error', () => {
    //   const expectedResult = {
    //     ...initialState,
    //     loaded: true,
    //     loading: false,
    //     error: null,
    //     ids: ['653ada50-acf5-4a52-a283-24b9c8632511'],
    //     entities: {
    //       '653ada50-acf5-4a52-a283-24b9c8632511': {
    //         id: '653ada50-acf5-4a52-a283-24b9c8632511',
    //         disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
    //         title: 'some text',
    //         responses: [],
    //         sentences: []
    //       }
    //     }
    //
    //   };
    //   const action = new fromAction.LoadParagraphsSuccess(pleading);
    //   const result = reducer(initialState, action);
    //   expect(result).toEqual(expectedResult);
    // });
  });
  describe('Create Pleading', () => {
    const pleading: Pleading = {
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      disputeId: '653ada50-acf5-4a52-a283-24b9c86325b1',
      title: 'some text',
      responses: [],
      sentences: []
    };
    const removeAction = new fromAction.CreateParagraph(pleading);

    // it('should set loading = true, error = null', () => {
    //   const action = new fromAction.CreateParagraph(pleading);
    //   const expectedResult = {
    //     ...initialState,
    //     loading: true,
    //     error: null,
    //     ids: ['653ada50-acf5-4a52-a283-24b9c86325b1'],
    //     entities: {
    //       '653ada50-acf5-4a52-a283-24b9c86325b1': {...pleading}
    //     }
    //   };
    //   const result = reducer(initialState, action);
    //
    //   expect(result).toEqual(expectedResult);
    //
    // });
    it('should set loading = false, error = null when create success', () => {
      const action = new fromAction.CreateParagraphSuccess(pleading);
      const expectedResult = {
        ...initialState,
        loading: false,
        error: null,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);
    });
    it('should return error when create fail', () => {
      const action = new fromAction.CreateParagraphFail({failedAction: removeAction});
      const expectedResult = {
        ...initialState, loading: false, error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });

  });
  describe('Update Pleading', () => {
    const pleading: Pleading = {
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      disputeId: '653ada50-acf5-4a52-a283-24b9c86325e1',
      title: 'some text',
      responses: [],
      sentences: []
    };
    const removeAction = new fromAction.UpdateParagraph(pleading);

    it('should set loading = true, error = null', () => {
      const action = new fromAction.UpdateParagraph(pleading);
      const expectedResult = {
        ...initialState,
        loading: true,
        error: null
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);

    });
    it('should set loading = false, error = null when create success', () => {
      const action = new fromAction.UpdateParagraphSuccess(pleading);
      const expectedResult = {
        ...initialState,
        loading: false,
        error: null,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);
    });
    it('should return error when create fail', () => {
      const action = new fromAction.UpdateParagraphFail({failedAction: removeAction});
      const expectedResult = {
        ...initialState, loading: false, error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });

  });
  describe('Delete Pleading', () => {
    const pleading: Pleading = {
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      disputeId: '653ada50-acf5-4a52-a283-24b9c86325b1',
      title: 'some text',
      responses: [],
      sentences: []
    };
    const removeAction = new fromAction.RemoveParagraph(pleading);

    it('should set loading = true, error = null', () => {
      const action = new fromAction.RemoveParagraph(pleading);
      const expectedResult = {
        ...initialState,
        loading: true,
        error: null,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);

    });
    it('should set loading = false, error = null when delete success', () => {
      const action = new fromAction.RemoveParagraphSuccess(pleading);
      const expectedResult = {
        ...initialState,
        loading: false,
        error: null,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);
    });
    it('should return error when create fail', () => {
      const action = new fromAction.RemoveParagraphFail({failedAction: removeAction});
      const expectedResult = {
        ...initialState, loading: false, error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });

  });
  describe('Add Paragraph Sentence', () => {
    const newState = {
      ids: ['653ada50-acf5-4a52-a283-24b9c8632511'],
      entities: {
        '653ada50-acf5-4a52-a283-24b9c8632511': {
          id: '653ada50-acf5-4a52-a283-24b9c8632511',
          disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
          title: 'some text',
          responses: [],
          sentences: [{id: '653ada50-acf5-4a52-a283-24b9c86325bb', text: 'test'}]
        }
      },
      disputeIdOfEntries: '653ada50-acf5-4a52-a283-24b9c86325ee',
      loading: false,
      loaded: false,
      error: null
    };

    const sentence = {
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      beforeSentenceId: '',
      paragraphId: '653ada50-acf5-4a52-a283-24b9c8632511',
      text: 'test',
    };
    const removeAction = new fromAction.AddParagraphSentences(sentence);

    it('should set loading = true, error = null', () => {

      const action = new fromAction.AddParagraphSentences(sentence);
      const result = reducer(newState, action);

      expect(result.entities['653ada50-acf5-4a52-a283-24b9c8632511'].sentences.length).toEqual(2);

    });
    it('should set loading = false, error = null when create success', () => {
      const action = new fromAction.AddParagraphSentencesSuccess(sentence);
      const expectedResult = {
        ...newState,
        loading: false,
        error: null,
      };
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);
    });
    it('should return error when create fail', () => {
      const action = new fromAction.AddParagraphSentencesFail({failedAction: removeAction});
      const expectedResult = {
        ...initialState, loading: false, error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });

  });
  describe('Create Response', () => {
    const newState = {
      ids: ['653ada50-acf5-4a52-a283-24b9c8632511'],
      entities: {
        '653ada50-acf5-4a52-a283-24b9c8632511': {
          id: '653ada50-acf5-4a52-a283-24b9c8632511',
          disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
          title: 'some text',
          responses: [],
          sentences: [{id: '653ada50-acf5-4a52-a283-24b9c86325bb', text: 'test'}]
        }
      },
      disputeIdOfEntries: '653ada50-acf5-4a52-a283-24b9c86325ee',
      loading: false,
      loaded: false,
      error: null
    };
    const response = {
      disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
      paragraphId: '653ada50-acf5-4a52-a283-24b9c8632511',
      id: 'a50-acf5-4a52-a283ada50-24b9c6a',
      title: 'some text',
      sentences: []
    };
    const removeAction = new fromAction.CreateResponse(response);

    it('should set loading = true, error = null', () => {
      const action = new fromAction.CreateResponse(response);
      const result = reducer(newState, action);

      expect(result.entities['653ada50-acf5-4a52-a283-24b9c8632511'].responses.length).toEqual(1);

    });
    it('should set loading = false, error = null when create success', () => {
      const action = new fromAction.CreateResponseSuccess(response);
      const expectedResult = {
        ...newState,
        loading: false,
        error: null,
      };
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);
    });
    it('should return error when create fail', () => {
      const action = new fromAction.CreateResponseFail({failedAction: removeAction});
      const expectedResult = {
        ...newState, loading: false, error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(newState, action);
      expect(result).toEqual(expectedResult);
    });

  });
  describe('Update Response', () => {
    const newState = {
      ids: ['653ada50-acf5-4a52-a283-24b9c8632511'],
      entities: {
        '653ada50-acf5-4a52-a283-24b9c8632511': {
          id: '653ada50-acf5-4a52-a283-24b9c8632511',
          disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
          title: 'some text',
          responses: [{
            disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
            paragraphId: '653ada50-acf5-4a52-a283-24b9c8632511',
            id: 'a50-acf5-4a52-a283ada50-24b9c6a',
            title: 'some text',
            sentences: []
          }],
          sentences: [{id: '653ada50-acf5-4a52-a283-24b9c86325bb', text: 'test'}]
        }
      },
      disputeIdOfEntries: '653ada50-acf5-4a52-a283-24b9c86325ee',
      loading: false,
      loaded: false,
      error: null
    };
    const response = {
      disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
      paragraphId: '653ada50-acf5-4a52-a283-24b9c8632511',
      id: 'a50-acf5-4a52-a283ada50-24b9c6a',
      title: 'some text',
      sentences: []
    };
    const removeAction = new fromAction.UpdateResponse(response);

    it('should set loading = true, error = null', () => {
      const action = new fromAction.UpdateResponse(response);
      const expectedResult = {
        ...newState,
        loading: true,
        error: null
      };
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);

    });
    it('should set loading = false, error = null when create success', () => {
      const action = new fromAction.UpdateResponseSuccess();
      const expectedResult = {
        ...newState,
        loading: false,
        error: null,
      };
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);
    });
    it('should return error when create fail', () => {
      const action = new fromAction.UpdateResponseFail({failedAction: removeAction});
      const expectedResult = {
        ...newState, loading: false, error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(newState, action);
      expect(result).toEqual(expectedResult);
    });

  });
  describe('Delete Response', () => {
    const newState = {
      ids: ['653ada50-acf5-4a52-a283-24b9c8632511'],
      entities: {
        '653ada50-acf5-4a52-a283-24b9c8632511': {
          id: '653ada50-acf5-4a52-a283-24b9c8632511',
          disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
          title: 'some text',
          responses: [{
            disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
            paragraphId: '653ada50-acf5-4a52-a283-24b9c8632511',
            id: 'a50-acf5-4a52-a283ada50-24b9c6a',
            title: 'some text',
            sentences: []
          }],
          sentences: [{id: '653ada50-acf5-4a52-a283-24b9c86325bb', text: 'test'}]
        }
      },
      disputeIdOfEntries: '653ada50-acf5-4a52-a283-24b9c86325ee',
      loading: false,
      loaded: false,
      error: null
    };
    const response = {
      disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
      paragraphId: '653ada50-acf5-4a52-a283-24b9c8632511',
      id: 'a50-acf5-4a52-a283ada50-24b9c6a',
      title: 'some text',
      sentences: []
    };
    const removeAction = new fromAction.RemoveResponse(response);

    it('should set loading = true, error = null', () => {
      const action = new fromAction.RemoveResponse(response);
      const result = reducer(newState, action);

      expect(result.entities['653ada50-acf5-4a52-a283-24b9c8632511'].responses.length).toEqual(0);

    });
    it('should set loading = false, error = null when delete success', () => {
      const action = new fromAction.RemoveResponseSuccess(response);
      const expectedResult = {
        ...newState,
        loading: false,
        error: null,
      };
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);
    });
    it('should return error when create fail', () => {
      const action = new fromAction.RemoveResponseFail({failedAction: removeAction});
      const expectedResult = {
        ...newState, loading: false, error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(newState, action);
      expect(result).toEqual(expectedResult);
    });

  });
  describe('Add Response Sentence', () => {
    const newState = {
      ids: ['653ada50-acf5-4a52-a283-24b9c8632511'],
      entities: {
        '653ada50-acf5-4a52-a283-24b9c8632511': {
          id: '653ada50-acf5-4a52-a283-24b9c8632511',
          disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
          title: 'some text',
          responses: [{
            disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
            paragraphId: '653ada50-acf5-4a52-a283-24b9c8632511',
            id: 'a50-acf5-4a52-a283ada50-24b9c6a',
            title: 'some text',
            sentences: [{
              id: '653ada50-acf5-4a52-a283-24b9c86325b1',
              paragraphId: '653ada50-acf5-4a52-a283-24b9c8632511',
              text: 'some text',
            }]
          }],
          sentences: [{id: '653ada50-acf5-4a52-a283-24b9c86325bb', text: 'test'}]
        }
      },
      disputeIdOfEntries: '653ada50-acf5-4a52-a283-24b9c86325ee',
      loading: false,
      loaded: false,
      error: null
    };
    const sentence = {
      responseId: 'a50-acf5-4a52-a283ada50-24b9c6a',
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      paragraphId: '653ada50-acf5-4a52-a283-24b9c8632511',
      text: 'some text',
    };
    const removeAction = new fromAction.AddResponseSentences(sentence);
    it('should set loading = false, error = null when create success', () => {
      const action = new fromAction.AddResponseSentencesSuccess(sentence);
      const expectedResult = {
        ...newState,
        loading: false,
        error: null,
      };
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);
    });
    it('should return error when create fail', () => {
      const action = new fromAction.AddResponseSentencesFail({failedAction: removeAction});
      const expectedResult = {
        ...newState, loading: false, error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(newState, action);
      expect(result).toEqual(expectedResult);
    });

  });
  describe('Update Sentence', () => {
    const newState = {
      ids: ['653ada50-acf5-4a52-a283-24b9c8632511'],
      entities: {
        '653ada50-acf5-4a52-a283-24b9c8632511': {
          id: '653ada50-acf5-4a52-a283-24b9c8632511',
          disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
          title: 'some text',
          responses: [{
            disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
            paragraphId: '653ada50-acf5-4a52-a283-24b9c8632511',
            id: 'a50-acf5-4a52-a283ada50-24b9c6a',
            title: 'some text',
            sentences: []
          }],
          sentences: [{id: '653ada50-acf5-4a52-a283-24b9c86325bb', text: 'test'}]
        }
      },
      disputeIdOfEntries: '653ada50-acf5-4a52-a283-24b9c86325ee',
      loading: false,
      loaded: false,
      error: null
    };
    const sentence = {
      responseId: 'a50-acf5-4a52-a283ada50-24b9c6a',
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      paragraphId: '653ada50-acf5-4a52-a283-24b9c8632511',
      text: 'some text',
    };
    const removeAction = new fromAction.UpdateSentence(sentence);

    it('should set loading = true, error = null', () => {
      const action = new fromAction.UpdateSentence(sentence);
      const expectedResult = {
        ...newState,
        loading: true,
        error: null
      };
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);

    });
    it('should set loading = false, error = null when create success', () => {
      const action = new fromAction.UpdateSentenceSuccess(sentence);
      const expectedResult = {
        ...newState,
        loading: false,
        error: null,
      };
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);
    });
    it('should return error when create fail', () => {
      const action = new fromAction.UpdateSentenceFail({failedAction: removeAction});
      const expectedResult = {
        ...newState, loading: false, error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(newState, action);
      expect(result).toEqual(expectedResult);
    });

  });
  describe('Delete Sentence', () => {
    const newState = {
      ids: ['653ada50-acf5-4a52-a283-24b9c8632511'],
      entities: {
        '653ada50-acf5-4a52-a283-24b9c8632511': {
          id: '653ada50-acf5-4a52-a283-24b9c8632511',
          disputeId: '653ada50-acf5-4a52-a283-24b9c86325ee',
          title: 'some text',
          responses: [],
          sentences: [{id: '653ada50-acf5-4a52-a283-24b9c86325bb', text: 'test'}]
        }
      },
      disputeIdOfEntries: '653ada50-acf5-4a52-a283-24b9c86325ee',
      loading: false,
      loaded: false,
      error: null
    };

    const sentence = {
      sentence: {id: '653ada50-acf5-4a52-a283-24b9c86325bb'},
      id: '653ada50-acf5-4a52-a283-24b9c86325bb',
      paragraphId: '653ada50-acf5-4a52-a283-24b9c8632511',
      text: 'test',
    };
    const removeAction = new fromAction.RemoveSentence(sentence);

    it('should set loading = true, error = null', () => {
      const action = new fromAction.RemoveSentence(sentence);
      const result = reducer(newState, action);

      expect(result.entities['653ada50-acf5-4a52-a283-24b9c8632511'].sentences.length).toEqual(0);

    });
    it('should set loading = false, error = null when delete success', () => {
      const action = new fromAction.RemoveSentenceSuccess(sentence);
      const expectedResult = {
        ...newState,
        loading: false,
        error: null,
      };
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);
    });
    it('should return error when create fail', () => {
      const action = new fromAction.RemoveSentenceFail({failedAction: removeAction});
      const expectedResult = {
        ...newState, loading: false, error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(newState, action);
      expect(result).toEqual(expectedResult);
    });

  });
  describe('Selectors', () => {
    it('should return the loading status', () => {
      const result = fromPleadings.getPleadingsLoading({
        ...initialState,
        loading: true,
      });
      expect(result).toBe(true);
    });

    it('should return the error', () => {
      const result = fromPleadings.getError({
        ...initialState,
        error: {
          message: 'Sorry, some thing is wrong...',
          failedAction: {} as any
        }
      });
      expect(result).toBeTruthy();
    });

  });
  describe('Assign Sentence To Issue', () => {
    const updateModel = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      paragraphId: '653ada50-acf5-4a52-a283-24b9c86456b1',
      response: [],
      sentence: {id: '473ada50-acf5-23ac43-24b94a52-a283', issueIds: ['23ac43-24b94a52-acf5-473ada50']}
    };
    const removeAction = new fromAction.AssignSentenceToIssue(updateModel);
    it('should set loading = false, error = null when create success', () => {
      const action = new fromAction.AssignSentenceToIssueSuccess(updateModel);
      const expectedResult = {
        ...initialState,
        loading: false,
        error: null,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);
    });
    it('should return error when create fail', () => {
      const action = new fromAction.AssignSentenceToIssueFail({failedAction: removeAction});
      const expectedResult = {
        ...initialState, loading: false, error: {message: fromPleadings.errorMessage, failedAction: removeAction}
      };
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
  });
});
