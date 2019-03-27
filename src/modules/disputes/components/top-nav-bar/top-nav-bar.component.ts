import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../../_store';
import { Dispute } from '../../models';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})

export class TopNavBarComponent {
  dispute$: Observable<Dispute>;

  constructor(private store: Store<fromStore.DisputeState>) {
    this.dispute$ = this.store.pipe(select(fromStore.selectCurrentDispute));
  }
}
