import { ActionReducer } from '@ngrx/store';
import { UNDO } from '../actions/undo.action';

const bufferSize = 5;

export function undoReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  const executedActions: Array<{ state: any; type: string }> = [];

  return (state: any, action: any) => {
    if (action.type === UNDO) {
      const index = executedActions.findIndex(e => e.type === action.payload);

      if (index >= 0 && index < executedActions.length) {
        const executedAction = executedActions[index + 1];

        const newState = reducer(executedAction.state, action);
        executedActions.unshift({state: newState, type: action.type});
        return newState;
      }
    }

    const updateState = reducer(state, action);
    executedActions.unshift({state: updateState, type: action.type});
    if (executedActions.length > bufferSize) {
      executedActions.pop();
    }
    return updateState;
  };
}
