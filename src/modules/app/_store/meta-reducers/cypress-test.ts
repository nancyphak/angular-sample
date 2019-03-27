import { ActionReducer, Action } from '@ngrx/store';

export function cypress<T, V extends Action = Action>(reducer: ActionReducer<T, V>): ActionReducer<T, V> {

  const appStates = new Map<number, T>();

  return (state: T, action: V): T => {

    if (action.type === 'TESTING_COMMIT_STATE') {
      appStates.set(action['payload'].index, state);
    }

    if (action.type === 'TESTING_JUMP_TO_STATE') {
      const s = appStates.get(action['payload'].index);
      if (s) {
        return s;
      }
    }

    const newState = reducer(state, action);
    return newState;
  };

}
