import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { AppState } from '../_store';

@Injectable()
export class AppStoreTestingService {
  stateId: number;

  constructor(private store: Store<AppState>) {
    window.addEventListener('commitState', () => {
      this.stateId = this.commit();

    }, false);

    window.addEventListener('resetState', () => {
      this.jumpToState(this.stateId);
    }, false);
  }

  dispatch(action) {
    this.store.dispatch(action);
  }

  commit() {
    const index = Date.now();
    this.dispatch({
      type: 'TESTING_COMMIT_STATE',
      payload: { index: index }
    });
    return index;
  }

  jumpToState(index: number) {
    this.dispatch({
      type: 'TESTING_JUMP_TO_STATE',
      payload: { index: index }
    });
  }
}
