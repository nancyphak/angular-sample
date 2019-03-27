import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as _ from 'lodash';

import { Error } from 'modules/app/_store';
import * as actionsUpload from '../actions/upload-file.action';
import { FileUpload } from '../../models';

export interface State extends EntityState<FileUpload> {
  loaded: boolean;
  loading: boolean;
  error: Error;
  uploadsVisible: boolean;
}

export const adapter: EntityAdapter<FileUpload> = createEntityAdapter<FileUpload>({
});

export const initialState = adapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
  uploadsVisible: false
});

export function reducer(state = initialState, action: actionsUpload.Actions): State {
  switch (action.type) {

    case actionsUpload.UPLOADS_DISMISSED: {
      const filesUploading = Object.keys(state.entities).map(key => state.entities[key]);

      if (filesUploading.every(f => f.isSuccess || f.isCancel)) {

        return adapter.removeAll({
          ...state,
          uploadsVisible: false,
        });

      } else {
        return state;
      }
    }

    case actionsUpload.UPLOAD_COMPLETE_DELAY: {
      return adapter.removeAll({
        ...state,
        uploadsVisible: false,
      });
    }

    case actionsUpload.UPLOAD_SESSION_STARTED: {
      return {
        ...state,
        uploadsVisible: true
      };
    }

    case actionsUpload.UPLOAD: {
      return adapter.addMany(action.payload, state);
    }

    case actionsUpload.UPLOAD_PROGRESS: {
      const file = state.entities[action.payload.id];
      return adapter.updateOne({
        id: action.payload.id,
        changes: {
          ...file,
          progress: action.payload.progress
        }
      }, state);
    }

    case actionsUpload.UPLOAD_SUCCESS: {

      const file = state.entities[action.payload.id];
      return adapter.updateOne({
        id: action.payload.id,
        changes: {
          ...file,
          isSuccess: true,
          progress: 100
        }
      }, state);
    }

    case actionsUpload.UPLOAD_FAIL: {
      const file = state.entities[action.payload.id];
      return adapter.updateOne({
        id: action.payload.id,
        changes: {
          ...file,
          error: action.payload.error,
          isError: true
        }
      }, state);
    }

    case actionsUpload.UPLOAD_CANCEL: {
      const file = _.cloneDeep(state.entities[action.payload.id]);

      return adapter.updateOne({
        id: action.payload.id,
        changes: {
          ...file,
          isCancel: true
        }
      }, state);
    }

    default: {
      return state;
    }
  }
}

export const uploadsVisible = (state: State) => state.uploadsVisible;

