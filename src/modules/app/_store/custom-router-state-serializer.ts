import { ActivatedRouteSnapshot, Params, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterUrlState } from './reducers/router.reducer';

export class CustomRouterStateSerializer implements RouterStateSerializer<RouterUrlState> {
  serialize(routerState: RouterStateSnapshot): RouterUrlState {
    const { url } = routerState;
    const { queryParams } = routerState.root;
    let params: Params = {};
    let state: ActivatedRouteSnapshot = routerState.root;

    while (state.firstChild) {
      state = state.firstChild;
      if (state.params) {
        params = {
          ...params,
          ...state.params
        };
      }
    }

    return { url, queryParams, params };
  }
}
