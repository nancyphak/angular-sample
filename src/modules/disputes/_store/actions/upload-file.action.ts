import { Action } from '@ngrx/store';
import { FileUpload } from '../../models';

export const UPLOAD = '[UploadFile] Upload';
export const UPLOAD_PROGRESS = '[UploadFile] Upload Progress';
export const UPLOAD_SUCCESS = '[UploadFile] Upload Success';
export const UPLOAD_FAIL = '[UploadFile] Upload Fail';
export const UPLOAD_CANCEL = '[UploadFile] Upload Cancel';
export const UPLOAD_COMPLETE_DELAY = '[UploadFile] Delay after all uploads complete';
export const UPLOAD_SESSION_STARTED = '[UploadFile] Upload session started';
export const UPLOADS_DISMISSED = '[UploadFile] Uploads dismissed';

export class UploadsDismissed implements Action {
  readonly type = UPLOADS_DISMISSED;
}

export class DelayCompletedAfterAllUploadsDone implements Action {
  readonly type = UPLOAD_COMPLETE_DELAY;
}

export class UploadSessionStarted implements Action {
  readonly type = UPLOAD_SESSION_STARTED;
}

export class Upload implements Action {
  readonly type = UPLOAD;

  constructor(public payload: FileUpload[]) {
  }
}

export class UploadProgress implements Action {
  readonly type = UPLOAD_PROGRESS;

  constructor(public payload: { id: string, progress: number }) {
  }
}

export class UploadSuccess implements Action {
  readonly type = UPLOAD_SUCCESS;

  constructor(public payload: { id: string }) {
  }
}

export class UploadFail implements Action {
  readonly type = UPLOAD_FAIL;

  constructor(public payload: { id: string, error: any }) {
  }
}

export class UploadCancel implements Action {
  readonly type = UPLOAD_CANCEL;

  constructor(public payload: { id: string }) {
  }
}

export type Actions =
  UploadsDismissed |
  DelayCompletedAfterAllUploadsDone |
  UploadSessionStarted |
  Upload |
  UploadProgress |
  UploadSuccess |
  UploadFail |
  UploadCancel;

