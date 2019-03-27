import * as fromDocuments from './documents.reducer';
import { initialState, reducer } from './documents.reducer';
import * as fromActions from '../actions';

describe('DocumentsReducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const actualResult = reducer(undefined, {} as any);
      expect(actualResult).toBe(initialState);
    });
  });

  describe('Get Document By Dispute and return success', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const documents = [
      {
        id: '1205a7c4-4624-42fc-af4e-c37df647c55c',
        name: 'name 1',
        description: 'description 1',
        extension: 'pdf',
        disputeId: disputeId,
        documentType: 'd5b88717-f45e-456f-898f-cb18387ef596',
      },
      {
        id: '1205a7c4-4624-42fc-af4e-c37df647c55b',
        name: 'name 2',
        description: 'description 2',
        extension: 'pdf',
        disputeId: disputeId,
        documentType: '6d895c27-3535-4db8-a125-5dcdc3766f1f',
      }
    ];
    const getAction = new fromActions.GetDocumentsByDispute({disputeId: disputeId});

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...initialState,
        loading: true,
        haveLoad: true,
        documentsLoading: true
      };

      const result = reducer(initialState, getAction);
      expect(result).toEqual(expectedResult);
    });

    it('should set correct value to properties when returning success', () => {
      const expectedResult = {
        ...initialState,
        haveLoad: true,
        loading: false,
        documentsLoading: false,
        disputeIdOfDocumentEntries: disputeId,
        ids: [documents[0].id, documents[1].id],
        entities: {
          '1205a7c4-4624-42fc-af4e-c37df647c55c': {
            ...documents[0]
          },
          '1205a7c4-4624-42fc-af4e-c37df647c55b': {
            ...documents[1]
          },
        }
      };

      const action = new fromActions.GetDocumentsByDisputeSuccess({
        documents,
        disputeIdOfDocumentEntries: disputeId
      });

      const result = reducer(reducer(initialState, getAction), action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Get Document By Dispute and return fail', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const getAction = new fromActions.GetDocumentsByDispute({disputeId: disputeId});

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...initialState,
        loading: true,
        haveLoad: true,
        documentsLoading: true
      };
      const result = reducer(initialState, getAction);
      expect(result).toEqual(expectedResult);
    });

    it('should set correct value to properties when returning fail', () => {
      const expectedResult = {
        ...initialState,
        haveLoad: true,
        documentsLoading: false,
        loaded: false,
        loading: false,
        error: {
          message: fromDocuments.errorMessage,
          failedAction: getAction
        }
      };
      const action = new fromActions.GetDocumentsByDisputeFail({
        failedAction: getAction
      });

      const result = reducer(reducer(initialState, getAction), action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Select Document', () => {
    const documentId = '1205a7c4-4624-42fc-af4e-c37df647c55c';
    const selectAction = new fromActions.SelectDocument({id: documentId});

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...initialState,
        selectedDocumentId: documentId,
        documentMetadataVisible: true
      };

      const result = reducer(initialState, selectAction);
      expect(result).toEqual(expectedResult);
    });

    it('should set correct value to properties when selecting again', () => {
      const expectedResult = {
        ...initialState,
        selectedDocumentId: null,
        documentMetadataVisible: false
      };
      const action = new fromActions.SelectDocument({id: documentId});
      const result = reducer(reducer(initialState, selectAction), action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('User left', () => {
    it('should set correct value to properties when leaving document page', () => {
      const expectedResult = {
        ...initialState,
        selectedDocumentId: null,
        documentMetadataVisible: false
      };
      const action = new fromActions.UserLeftDocumentPage();
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);
    });

    it('should set correct value to properties when leaving document view page', () => {
      const expectedResult = {
        ...initialState,
        selectedDocumentId: null
      };
      const action = new fromActions.UserLeftDocumentViewPage();
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Get Document MetaData By Dispute and return success', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const documentMetadata = [
      {
        date: '2018-11-08T17:00:00Z',
        dateDiscovery: '2018-11-08T17:00:00Z',
        disputeId: disputeId,
        documentId: '489b0e54-d363-4c98-ac12-6889e53de3dd',
        notes: 'note 1',
        typeId: '6d895c27-3535-4db8-a125-5dcdc3766f1f',
      },
      {
        date: '2018-11-08T17:00:00Z',
        dateDiscovery: '2018-11-08T17:00:00Z',
        disputeId: disputeId,
        documentId: '1205a7c4-4624-42fc-af4e-c37df647c55c',
        notes: 'note 2',
        typeId: '6d895c27-3535-4db8-a125-5dcdc3766f1f',
      }
    ];
    const getAction = new fromActions.GetDocumentMetadataByDispute({disputeId: disputeId});

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...initialState,
        loading: true
      };

      const result = reducer(initialState, getAction);
      expect(result).toEqual(expectedResult);
    });

    it('should set correct value to properties when returning success', () => {
      const expectedResult = {
        ...initialState,
        loading: false,
        disputeIdOfDocumentMetadataEntries: disputeId,
        documentMetadata
      };
      const action = new fromActions.GetDocumentMetadataByDisputeSuccess({
        documentMetadata,
        disputeIdOfDocumentMetadataEntries: disputeId
      });

      const result = reducer(reducer(initialState, getAction), action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Get Document MetaData By Dispute and return fail', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const getAction = new fromActions.GetDocumentMetadataByDispute({disputeId: disputeId});

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...initialState,
        loading: true
      };
      const result = reducer(initialState, getAction);
      expect(result).toEqual(expectedResult);
    });

    it('should set correct value to properties when returning fail', () => {
      const expectedResultAfterReturn = {
        ...initialState,
        loaded: false,
        loading: false,
        error: {
          message: fromDocuments.errorMessage,
          failedAction: getAction
        }
      };
      const action = new fromActions.GetDocumentMetadataByDisputeFail({
        failedAction: getAction
      });

      const result = reducer(reducer(initialState, getAction), action);
      expect(result).toEqual(expectedResultAfterReturn);
    });
  });

  describe('Set Document MetaData and return success', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const document = {
      date: '2018-11-08T17:00:00Z',
      dateDiscovery: '2018-11-08T17:00:00Z',
      disputeId: disputeId,
      documentId: '489b0e54-d363-4c98-ac12-6889e53de3dd',
      notes: 'note 1',
      typeId: '6d895c27-3535-4db8-a125-5dcdc3766f1f',
    };
    const documentEdited = {
      ...document,
      notes: 'note 1 edited'
    };
    const state = {
      ...initialState,
      documentMetadata: [document]
    };
    const setAction = new fromActions.SetDocumentMetadata(documentEdited);

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...state,
        loading: true,
        documentMetadata: [documentEdited]
      };

      const result = reducer(state, setAction);
      expect(result).toEqual(expectedResult);
    });

    it('should set correct value to properties when returning success', () => {
      const expectedResult = {
        ...state,
        loading: false,
        documentMetadata: [documentEdited]
      };
      const action = new fromActions.SetDocumentMetadataSuccess();

      const result = reducer(reducer(state, setAction), action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Set Document MetaData and return fail', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const document = {
      date: '2018-11-08T17:00:00Z',
      dateDiscovery: '2018-11-08T17:00:00Z',
      disputeId: disputeId,
      documentId: '489b0e54-d363-4c98-ac12-6889e53de3dd',
      notes: 'note 1',
      typeId: '6d895c27-3535-4db8-a125-5dcdc3766f1f',
    };
    const documentEdited = {
      ...document,
      notes: 'note 1 edited'
    };
    const setAction = new fromActions.SetDocumentMetadata(documentEdited);

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...initialState,
        loading: true,
        documentMetadata: [ documentEdited ]
      };
      const result = reducer(initialState, setAction);
      expect(result).toEqual(expectedResult);
    });

    it('should set correct value to properties when returning fail', () => {
      const expectedResult = {
        ...initialState,
        loaded: false,
        loading: false,
        documentMetadata: [ documentEdited ],
        error: {
          message: fromDocuments.errorMessage,
          failedAction: setAction
        }
      };

      const action = new fromActions.SetDocumentMetadataFail({
        failedAction: setAction
      });

      const result = reducer(reducer(initialState, setAction), action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Set Document Description and return success', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const document = {
      id: '1205a7c4-4624-42fc-af4e-c37df647c55c',
      name: 'name 1',
      description: 'description 1',
      extension: 'pdf',
      disputeId: disputeId,
      documentType: 'd5b88717-f45e-456f-898f-cb18387ef596',
    };
    const documentEdited = {
      ...document,
      description: 'description 1 edited',
    };
    const state = {
      ...initialState,
      ids: [document.id],
      entities: {
        '1205a7c4-4624-42fc-af4e-c37df647c55c': {
          ...document
        }
      }
    };
    const setAction = new fromActions.SetDocumentDescription(documentEdited);

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...state,
        loading: true,
        entities: {
          '1205a7c4-4624-42fc-af4e-c37df647c55c': {
            ...documentEdited
          }
        }
      };

      const result = reducer(state, setAction);
      expect(result).toEqual(expectedResult);
    });

    it('should set correct value to properties when returning success', () => {
      const expectedResult = {
        ...state,
        loading: false,
        entities: {
          '1205a7c4-4624-42fc-af4e-c37df647c55c': {
            ...documentEdited
          }
        }
      };
      const action = new fromActions.SetDocumentDescriptionSuccess();

      const result = reducer(reducer(state, setAction), action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Set Document Description and return fail', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const document = {
      id: '1205a7c4-4624-42fc-af4e-c37df647c55c',
      name: 'name 1',
      description: 'description 1',
      extension: 'pdf',
      disputeId: disputeId,
      documentType: 'd5b88717-f45e-456f-898f-cb18387ef596',
    };
    const documentEdited = {
      ...document,
      description: 'description 1 edited',
    };
    const setAction = new fromActions.SetDocumentDescription(documentEdited);
    const state = {
      ...initialState,
      ids: [document.id],
      entities: {
        '1205a7c4-4624-42fc-af4e-c37df647c55c': {
          ...document
        }
      }
    };

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...state,
        loading: true,
        entities: {
          '1205a7c4-4624-42fc-af4e-c37df647c55c': {
            ...documentEdited
          }
        }
      };
      const result = reducer(state, setAction);
      expect(result).toEqual(expectedResult);
    });

    it('should set correct value to properties when returning fail', () => {
      const expectedResult = {
        ...state,
        loaded: false,
        loading: false,
        error: {
          message: fromDocuments.errorMessage,
          failedAction: setAction
        },
        entities: {
          '1205a7c4-4624-42fc-af4e-c37df647c55c': {
            ...documentEdited
          }
        }
      };
      const action = new fromActions.SetDocumentDescriptionFail({
        failedAction: setAction
      });

      const result = reducer(reducer(state, setAction), action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Delete Document and return success', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const document = {
      id: '1205a7c4-4624-42fc-af4e-c37df647c55c',
      name: 'name 1',
      description: 'description 1',
      extension: 'pdf',
      disputeId: disputeId,
      documentType: 'd5b88717-f45e-456f-898f-cb18387ef596',
    };
    const state = {
      ...initialState,
      ids: [document.id],
      entities: {
        '1205a7c4-4624-42fc-af4e-c37df647c55c': {
          ...document
        }
      }
    };
    const deleteAction = new fromActions.DeleteDocument(document);

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...state,
        loading: true,
        ids: [],
        entities: {}
      };

      const result = reducer(state, deleteAction);
      expect(result).toEqual(expectedResult);
    });

    it('should set correct value to properties when returning success', () => {
      const expectedResult = {
        ...state,
        loading: false,
        ids: [],
        entities: {}
      };
      const action = new fromActions.DeleteDocumentSuccess(document);
      const result = reducer(reducer(state, deleteAction), action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Delete Document and return fail', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const document = {
      id: '1205a7c4-4624-42fc-af4e-c37df647c55c',
      name: 'name 1',
      description: 'description 1',
      extension: 'pdf',
      disputeId: disputeId,
      documentType: 'd5b88717-f45e-456f-898f-cb18387ef596',
    };
    const deleteAction = new fromActions.DeleteDocument(document);
    const state = {
      ...initialState,
      ids: [document.id],
      entities: {
        '1205a7c4-4624-42fc-af4e-c37df647c55c': {
          ...document
        }
      }
    };

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...state,
        loading: true,
        ids: [],
        entities: {}
      };
      const result = reducer(state, deleteAction);
      expect(result).toEqual(expectedResult);
    });

    it('should set correct value to properties when returning fail', () => {
      const expectedResult = {
        ...state,
        loaded: false,
        loading: false,
        error: {
          message: fromDocuments.errorMessage,
          failedAction: deleteAction
        },
        ids: [],
        entities: {}
      };
      const action = new fromActions.DeleteDocumentFail({
        failedAction: deleteAction
      });

      const result = reducer(reducer(state, deleteAction), action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Delete Document while it is selected', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';
    const document = {
      id: '1205a7c4-4624-42fc-af4e-c37df647c55c',
      name: 'name 1',
      description: 'description 1',
      extension: 'pdf',
      disputeId: disputeId,
      documentType: 'd5b88717-f45e-456f-898f-cb18387ef596',
    };
    const state = {
      ...initialState,
      selectedDocumentId: document.id,
      documentMetadataVisible: true,
      ids: [document.id],
      entities: {
        '1205a7c4-4624-42fc-af4e-c37df647c55c': {
          ...document
        }
      }
    };

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...state,
        documentMetadataVisible: false,
        loading: true,
        ids: [],
        entities: {}
      };

      const action = new fromActions.DeleteDocument(document);
      const result = reducer(state, action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Change Current Page Number', () => {
    const currentPageNumber = 2;

    it('should set correct value to properties', () => {
      const expectedResult = {
        ...initialState,
        currentPageNumber
      };
      const action = new fromActions.ChangeCurrentPageNumber(currentPageNumber);
      const result = reducer(initialState, action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Upload Complete Delay', () => {
    const state = {
      ...initialState,
      selectedDocumentId: '1205a7c4-4624-42fc-af4e-c37df647c55c'
    };

    it('should set correct value to properties when not having selectedDocumentId', () => {
      const action = new fromActions.DelayCompletedAfterAllUploadsDone();
      const result = reducer(initialState, action);
      expect(result).toEqual(initialState);
    });

    it('should set correct value to properties when having selectedDocumentId', () => {
      const expectedResult = {
        ...state,
        documentMetadataVisible: true
      };
      const action = new fromActions.DelayCompletedAfterAllUploadsDone();
      const result = reducer(state, action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Upload Session Started', () => {
    const state = {
      ...initialState,
      selectedDocumentId: '1205a7c4-4624-42fc-af4e-c37df647c55c'
    };

    it('should set correct value to properties when not having selectedDocumentId', () => {
      const action = new fromActions.UploadSessionStarted();
      const result = reducer(initialState, action);
      expect(result).toEqual(initialState);
    });

    it('should set correct value to properties when not having selectedDocumentId', () => {
      const expectedResult = {
        ...state,
        documentMetadataVisible: false
      };
      const action = new fromActions.UploadSessionStarted();
      const result = reducer(state, action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Selectors', () => {
    const state = {
      ids: [
        '1205a7c4-4624-42fc-af4e-c37df647c55c',
      ],
      entities: {
        '1205a7c4-4624-42fc-af4e-c37df647c55c': {
          id: '1205a7c4-4624-42fc-af4e-c37df647c55c',
          name: 'toi di code dao.pdf',
          length: 2245860,
          disputeId: '91c286d2-24be-4712-9171-42f48c56aba5',
          description: 'toi di code dao',
          extension: 'pdf'
        }
      },
      folderEntriesLoaded: false,
      disputeIdOfDocumentEntries: '91c286d2-24be-4712-9171-42f48c56aba5',
      disputeIdOfDocumentMetadataEntries: '91c286d2-24be-4712-9171-42f48c56aba5',
      selectedDocumentId: null,
      documentMetadata: [
        {
          documentId: '1205a7c4-4624-42fc-af4e-c37df647c55c',
          typeId: 'f9a72b7a-a1a9-42fb-8351-37d64c2cfaee',
          date: '2018-11-03T17:00:00Z',
          dateDiscovery: '2018-11-29T17:00:00Z',
          notes: '12\nsad\nasd\nsad\nsa',
          disputeId: '91c286d2-24be-4712-9171-42f48c56aba5'
        }
      ],
      loaded: false,
      haveLoad: true,
      loading: false,
      documentsLoading: false,
      documentMetadataVisible: false,
      error: null,
      currentPageNumber: 2
    };

    it('should return loading', () => {
      const result = fromDocuments.getDocumentLoading(state);
      expect(result).toBe(state.loading);
    });

    it('should return documentsLoading', () => {
      const result = fromDocuments.getDocumentsLoading(state);
      expect(result).toBe(state.documentsLoading);
    });

    it('should return haveLoad', () => {
      const result = fromDocuments.getHaveLoad(state);
      expect(result).toBe(state.haveLoad);
    });

    it('should return error', () => {
      const result = fromDocuments.getDocumentError(state);
      expect(result).toBe(state.error);
    });

    it('should return selectedDocumentId', () => {
      const result = fromDocuments.getCurrentDocumentId(state);
      expect(result).toBe(state.selectedDocumentId);
    });

    it('should return documentMetadata', () => {
      const result = fromDocuments.getListDocumentMetadata(state);
      expect(result).toBe(state.documentMetadata);
    });

    it('should return disputeIdOfDocumentEntries', () => {
      const result = fromDocuments.getDisputeIdOfDocumentEntries(state);
      expect(result).toBe(state.disputeIdOfDocumentEntries);
    });

    it('should return disputeIdOfDocumentMetadataEntries', () => {
      const result = fromDocuments.getDisputeIdOfDocumentMetadataEntries(state);
      expect(result).toBe(state.disputeIdOfDocumentMetadataEntries);
    });

    it('should return currentPageNumber', () => {
      const result = fromDocuments.getDocumentCurrentPageNumber(state);
      expect(result).toBe(state.currentPageNumber);
    });

    it('should return documentMetadataVisible', () => {
      const result = fromDocuments.getDocumentMetadataVisible(state);
      expect(result).toBe(state.documentMetadataVisible);
    });
  });

});
