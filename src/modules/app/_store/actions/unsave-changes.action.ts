import { Action } from '@ngrx/store';

export const SAVED_CHANGES = 'SAVED_CHANGES';
export const UNSAVED_CHANGES = 'UNSAVED_CHANGES';
export const DISCARD_CHANGES = 'DISCARD_CHANGES';

export const SHOWING_CONFIRM = 'SHOWING_CONFIRM';
export const CLOSING_CONFIRM = 'CLOSING_CONFIRM';

export class SaveChanges implements Action {
  readonly type = SAVED_CHANGES;
}

export class UnSaveChanges implements Action {
  readonly type = UNSAVED_CHANGES;
}

export class DiscardChanges implements Action {
  readonly type = DISCARD_CHANGES;
}

export class ShowingConfirm implements Action {
  readonly type = SHOWING_CONFIRM;
}

export class ClosingConfirm implements Action {
  readonly type = CLOSING_CONFIRM;
}

export type UnSaveChangesAction = SaveChanges | UnSaveChanges | DiscardChanges | ShowingConfirm | ClosingConfirm;
