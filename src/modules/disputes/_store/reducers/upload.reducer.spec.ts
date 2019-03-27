import { initialState, reducer, uploadsVisible } from './upload.reducer';
import * as fromAction from '../actions/upload-file.action';

describe('UploadReducer', () => {
  const files = [
    {
      disputeId: 'd3223788-dd89-48e8-9efe-023305be5f79',
      id: '4144bdd9-041d-4c3b-a11c-d3c0818f59b3',
      file: null,
      fileName: 'dotnet.pdf',
      fileType: 'pdf',
      progress: 0,
      isSuccess: false,
      isCancel: false,
    }
  ];
  const fileUpload = files[0];
  const newState = {
    ...initialState,
    ids: ['4144bdd9-041d-4c3b-a11c-d3c0818f59b3'],
    entities: {
      '4144bdd9-041d-4c3b-a11c-d3c0818f59b3': {
        disputeId: files[0].disputeId,
        id: fileUpload.id,
        file: fileUpload.file,
        fileName: fileUpload.fileName,
        fileType: fileUpload.fileType,
        progress: fileUpload.progress,
        isSuccess: fileUpload.isSuccess,
        isCancel: fileUpload.isCancel,
      }
    },
  };
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const actualResult = reducer(undefined, {} as any);

      expect(actualResult).toBe(initialState);
    });
  });

  describe('Dismissed upload', () => {
    it('should be able to update state have uploadsVisible = false', () => {
      const action = new fromAction.UploadsDismissed();
      const result = reducer(newState, action);
      const expectedResult = {
        ...newState,
        uploadsVisible: false,
      };

      expect(result).toEqual(expectedResult);

    });

    it('should be able to return state', () => {
      const action = new fromAction.UploadsDismissed();
      const result = reducer(newState, action);
      const expectedResult = {
        ...newState,
        uploadsVisible: false,
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Upload Complete delay', () => {
    it('should be able to update state have uploadsVisible = false', () => {
      const action = new fromAction.DelayCompletedAfterAllUploadsDone();
      const result = reducer(initialState, action);
      const expectedResult = {
        ...initialState,
        uploadsVisible: false,
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Upload session started', () => {
    it('should be able to update state have uploadsVisible = true', () => {
      const action = new fromAction.UploadSessionStarted();
      const result = reducer(newState, action);
      const expectedResult = {
        ...newState,
        uploadsVisible: true,
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Upload file', () => {
    it('should be able to upload a file', () => {
      const expectedResult = {
        ...initialState,
        ids: ['4144bdd9-041d-4c3b-a11c-d3c0818f59b3'],
        entities: {
          '4144bdd9-041d-4c3b-a11c-d3c0818f59b3': {
            disputeId: files[0].disputeId,
            id: fileUpload.id,
            file: fileUpload.file,
            fileName: fileUpload.fileName,
            fileType: fileUpload.fileType,
            progress: fileUpload.progress,
            isSuccess: fileUpload.isSuccess,
            isCancel: fileUpload.isCancel,
          }
        },
      };

      const action = new fromAction.Upload(files);
      const result = reducer(initialState, action);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Upload progress', () => {
    it('should be able to update progress', () => {

      const fileToUploadProgress = {
        id: '4144bdd9-041d-4c3b-a11c-d3c0818f59b3',
        progress: 17
      };

      const expectedResult = {
        ...newState,
        entities: {
          '4144bdd9-041d-4c3b-a11c-d3c0818f59b3': {
            disputeId: files[0].disputeId,
            id: fileUpload.id,
            file: fileUpload.file,
            fileName: fileUpload.fileName,
            fileType: fileUpload.fileType,
            progress: fileToUploadProgress.progress,
            isSuccess: fileUpload.isSuccess,
            isCancel: fileUpload.isCancel,
          }
        },
      };

      const action = new fromAction.UploadProgress(fileToUploadProgress);
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Upload success', () => {
    it('should able to update state isSuccess = true, progress = 100', () => {
      const fileToUploadSuccess = {
        id: '4144bdd9-041d-4c3b-a11c-d3c0818f59b3'
      };
      const expectedResult = {
        ...newState,
        entities: {
          '4144bdd9-041d-4c3b-a11c-d3c0818f59b3': {
            disputeId: files[0].disputeId,
            id: fileUpload.id,
            file: fileUpload.file,
            fileName: fileUpload.fileName,
            fileType: fileUpload.fileType,
            progress: 100,
            isSuccess: true,
            isCancel: fileUpload.isCancel,
          }
        },
      };

      const action = new fromAction.UploadSuccess(fileToUploadSuccess);
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Upload fail', () => {
    it('should able to update isError = true and error', () => {
      const fileToUploadFail = {
        id: '4144bdd9-041d-4c3b-a11c-d3c0818f59b3',
        error: 'Sorry, some thing is wrong...'
      };
      const expectedResult = {
        ...newState,
        entities: {
          '4144bdd9-041d-4c3b-a11c-d3c0818f59b3': {
            disputeId: files[0].disputeId,
            id: fileUpload.id,
            file: fileUpload.file,
            fileName: fileUpload.fileName,
            fileType: fileUpload.fileType,
            progress: fileUpload.progress,
            isSuccess: fileUpload.isSuccess,
            isCancel: fileUpload.isCancel,
            isError: true,
            error: fileToUploadFail.error,
          }
        },
      };

      const action = new fromAction.UploadFail(fileToUploadFail);
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Upload  cancel', () => {
    it('should able to update isCancel = true', () => {
      const fileToUploadCancel = {
        id: '4144bdd9-041d-4c3b-a11c-d3c0818f59b3'
      };
      const expectedResult = {
        ...newState,
        entities: {
          '4144bdd9-041d-4c3b-a11c-d3c0818f59b3': {
            disputeId: files[0].disputeId,
            id: fileUpload.id,
            file: fileUpload.file,
            fileName: fileUpload.fileName,
            fileType: fileUpload.fileType,
            progress: fileUpload.progress,
            isSuccess: fileUpload.isSuccess,
            isCancel: true,
          }
        },
      };

      const action = new fromAction.UploadCancel(fileToUploadCancel);
      const result = reducer(newState, action);

      expect(result).toEqual(expectedResult);

    });
  });

  describe('Selectors', () => {
    it('should return the uploadsVisible status', () => {
      const result = uploadsVisible({
        ...initialState,
        uploadsVisible: true,
      });

      expect(result).toBe(true);
    });
  });
});
