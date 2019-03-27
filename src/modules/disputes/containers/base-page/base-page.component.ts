import { ActivatedRoute, UrlSegment } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { AppInsights } from 'applicationinsights-js';

import {
  DiscardChanges, selectShowingConfirm,
  selectUnSavedChanges, ClosingConfirm, ShowingConfirm
} from 'modules/app/_store';
import { ComponentCanDeactivate, ConfirmDialog } from 'modules/shared';
import { DisputeState } from '../../_store/reducers';

export class BasePageComponent implements ComponentCanDeactivate {

  private unSaveChanges: Observable<boolean>;

  constructor(public route: ActivatedRoute,
              public store: Store<DisputeState>,
              public dialog: MatDialog) {
    this.trackPageView();
    this.unSaveChanges = this.store.pipe(select(selectUnSavedChanges));
  }

  canDeactivate() {
    return this.unSaveChanges.pipe(
      withLatestFrom(this.store.pipe(select(selectShowingConfirm))),
      switchMap((saved) => {
        if (saved[0] && !saved[1]) {
          this.store.dispatch(new ShowingConfirm());
          return this.dialog.open(ConfirmDialog, {
            width: '380px',
            data: {
              title: 'Discard change',
              message: 'Your changes have not been saved. Discard changes?',
              confirmButtonText: 'Discard',
              cancelButtonText: 'Cancel'
            }
          }).afterClosed().pipe(
            map(discard => !!discard),
            tap(discard => {
              this.store.dispatch(new ClosingConfirm());
              if (discard) {
                this.store.dispatch(new DiscardChanges());
              }
            }),
            take(1)
          );
        }
        return of(true);
      })
    );
  }

  private trackPageView() {
    const name = this.route.component['name'];
    const url = this.getPageUrl();
    const properties = {};
    AppInsights.trackPageView(name, url, properties);
  }

  private getPageUrl() {
    const urlSegments: Array<UrlSegment> = this.route.url['_value'];
    const segments = urlSegments.map(segment => segment.path);
    const url = segments.join('/');

    if (url.indexOf('disputes') < 0) {
      return this.route.snapshot['_routerState'].url;
    }
    return url;
  }

}
