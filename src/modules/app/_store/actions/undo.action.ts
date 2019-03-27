import { Action } from '@ngrx/store';

export const UNDO = '[Undo]';

export class Undo implements Action {
  readonly type = UNDO;

  constructor(public payload: string) {
  }
}

