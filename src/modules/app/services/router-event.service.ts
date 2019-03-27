import { Injectable } from '@angular/core';
import { ActivationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class RouterService {
  private rightPanelPathSource = new BehaviorSubject<any>(null);
  rightPanelPath$ = this.rightPanelPathSource.asObservable();

  private _params = {};
  private _route = {
    rightPanelPath: ''
  };

  get params() {
    return this._params;
  }

  get route() {
    return this._route;
  }

  constructor(private router: Router) {

    this.router.events.pipe(
      filter(event => event instanceof ActivationStart)
    ).subscribe((event: ActivationStart) => {
      if (event.snapshot.params) {
        this._params = {
          ...this._params,
          ...event.snapshot.params
        };
      }
      if (event.snapshot.data.rightSide) {
        this._route.rightPanelPath = event.snapshot.routeConfig.path;

        this.rightPanelPathSource.next(this._route.rightPanelPath);
      }
    });
  }

}
