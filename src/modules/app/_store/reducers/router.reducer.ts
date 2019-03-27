import { Params, RoutesRecognized } from '@angular/router';
import {
  RouterReducerState,
  RouterAction,
  ROUTER_NAVIGATION,
  ROUTER_CANCEL,
  ROUTER_ERROR,
} from '@ngrx/router-store';

export const ROUTER_ACTIVE = 'ROUTER_ACTIVE';

export interface RouterUrlState {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface State extends RouterReducerState<RouterUrlState> {
  activatedRoute: RouterUrlState;
}

export function reducer (
  state: State,
  action: RouterAction<any, any> | {
    type: 'ROUTER_ACTIVE';
    payload: { routerState: any, event: RoutesRecognized }
  }): State {

  switch (action.type) {
    case ROUTER_ACTIVE: {
      return {
        ...state,
        activatedRoute: action.payload.routerState
      };
    }
    case ROUTER_NAVIGATION:
    case ROUTER_ERROR:
    case ROUTER_CANCEL:
      return {
        activatedRoute: (state && typeof state.activatedRoute !== 'undefined') ? state.activatedRoute : null,
        state: action.payload.routerState,
        navigationId: action.payload.event.id,
      };
    default: {
      return state;
    }
  }
}


export const getNavigationId = (routerState: State) => routerState.navigationId;
export const getRouterState = (routerState: State) => routerState.state;
export const getActivatedRoute = (routerState: State) => routerState.activatedRoute;
