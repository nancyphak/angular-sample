import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromUpload from '../reducers/upload.reducer';

export const getUploadState = createSelector(
  fromFeature.getDisputeState,
  (state: fromFeature.DisputeState) => state.uploadFlies
);

export const {
  selectEntities: selectUploadEntities,
  selectAll: selectFilesUploading
} = fromUpload.adapter.getSelectors(getUploadState);

export const selectUploadsVisible = createSelector(
  getUploadState,
  fromUpload.uploadsVisible
);
