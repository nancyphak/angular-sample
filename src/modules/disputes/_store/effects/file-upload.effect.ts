import { Injectable } from '@angular/core';
import { HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of, Subscription } from 'rxjs';
import {
  debounceTime, distinctUntilChanged,
  filter, map, mergeMap, tap, withLatestFrom
} from 'rxjs/operators';

import * as uploadActions from '../actions';
import * as fileSelectors from '../../_store/selectors/upload-files.selectors';
import { UploadService } from '../../services';
import { DisputeState } from '../reducers';
import { getRouterState } from '../../../app/_store';
import { GetDocumentsByDispute } from '../actions';
import { FileUpload } from '../../models';

@Injectable()
export class UploadEffects {

  private uploadSubscription = new Map<string, Subscription>();

  constructor(private uploadService: UploadService,
              private actions$: Actions,
              private store: Store<DisputeState>) {
  }

  @Effect({dispatch: false})
  uploadFile$ = this.actions$.pipe(
    ofType(uploadActions.UPLOAD),
    map((action: uploadActions.Upload) => action.payload),
    tap(fileUpload => {

      if (fileUpload.length < 0) {
        return;
      }

      fileUpload.forEach((file: FileUpload) => {
        const subscription = this.uploadService.upload(file).subscribe(
          (event: HttpProgressEvent) => {
            if (event.type !== HttpEventType.UploadProgress) {
              return;
            }
            if (event && event.loaded && event.total) {
              const progress = Math.round(event.loaded * 100 / event.total);
              this.store.dispatch(new uploadActions.UploadProgress({
                id: file.id,
                progress: progress
              }));
            }
          },
          (error) => {
            this.store.dispatch(new uploadActions.UploadFail({
              id: file.id,
              error: error
            }));
          },
          () => {
            this.store.dispatch(new uploadActions.UploadSuccess({id: file.id}));
          }
        );

        this.uploadSubscription.set(file.id, subscription);
      });

    })
  );

  @Effect({dispatch: false})
  onCancelUpload$ = this.actions$.pipe(
    ofType(uploadActions.UPLOAD_CANCEL),
    map((action: uploadActions.UploadCancel) => action.payload),
    tap(({id}) => {
      const sub = this.uploadSubscription.get(id);
      if (sub) {
        sub.unsubscribe();
        this.uploadSubscription.delete(id);
      }
    })
  );

  /**
   * After uploads have completed, wait 3 seconds and dispatch an action
   * This is used to dismiss the upload bar if it is still open
   */

  @Effect()
  hideUploads$ = this.store.pipe(
    select(fileSelectors.selectFilesUploading),
    filter((filesUploading) => filesUploading.every(f => f.isSuccess || f.isCancel || f.isError) && filesUploading.length > 0),
    withLatestFrom(this.store.pipe(select(getRouterState))),
    tap(([files, routerState]) => {
      this.store.dispatch(new GetDocumentsByDispute({disputeId: routerState.state.params.disputeId}));
    }),
    debounceTime(3000),
    withLatestFrom(this.store.pipe(select(fileSelectors.selectFilesUploading))),
    filter(([, filesUploading]) => {
      return filesUploading.every(f => f.isSuccess || f.isCancel || f.isError) && filesUploading.length > 0;
    }),
    tap(() => this.uploadSubscription.clear()),
    mergeMap(() => of(new uploadActions.DelayCompletedAfterAllUploadsDone()))
  );

  /**
   * When there are uploads in the queue, signal that a session has started
   */
  @Effect()
  activeUploads$ = this.store.pipe(
    select(fileSelectors.selectFilesUploading),
    map((filesUploading) => filesUploading.length > 0),
    distinctUntilChanged(),
    filter((v) => v),
    mergeMap(() => of(new uploadActions.UploadSessionStarted()))
  );

}
