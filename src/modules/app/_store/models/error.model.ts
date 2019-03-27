import { Action } from '@ngrx/store';

export interface Error {
  message?: any;
  failedAction?: Action;
}
