import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthService } from 'modules/auth';
import { Dispute } from '../../models';
import * as fromStore from '../../_store';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})

export class TopBarComponent {
  colorIssue = undefined;
  dispute$: Observable<Dispute>;

  constructor(private store: Store<fromStore.DisputeState>,
              public auth: AuthService) {
    this.dispute$ = this.store.pipe(select(fromStore.selectCurrentDispute));
  }
}
