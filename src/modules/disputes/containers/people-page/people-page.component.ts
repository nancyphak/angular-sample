import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Observable, Subscription } from 'rxjs';

import { v4 as uuid } from 'uuid';
import { select, Store } from '@ngrx/store';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import * as _ from 'lodash';

import { AuthService } from 'modules/auth/services';
import { ConfirmDialog, NetworkService, PromptDialog } from 'modules/shared';
import { Error } from 'modules/app/_store';
import { DeletePersonModel, Dispute, Person, PersonDetailViewModel, RightSideMenu } from '../../models';
import * as fromStore from '../../_store';
import { AutoTrackViewComponent } from '../../../shared';
import { selectActivatedRoute } from '../../../app/_store';
import { withLatestFrom } from 'rxjs/operators';
import { RouterService } from '../../../app/services';

@Component({
  selector: 'people-page',
  templateUrl: './people-page.component.html',
  styleUrls: ['./people-page.component.scss']
})
export class PeoplePageComponent extends AutoTrackViewComponent implements OnInit, OnDestroy {

  people$: Observable<Array<Person>>;
  error$: Observable<Error>;
  loading$: Observable<boolean>;
  isExistsPerson$: Observable<boolean>;
  dispute$: Observable<Dispute>;
  personDetail$: Observable<PersonDetailViewModel>;
  activatedRoute$: Observable<any>;
  selectedPerson: Person;
  rightSideMenu: Array<RightSideMenu> = [
    {
      link: 'issues',
      name: 'Issues'
    },
    {
      link: 'events',
      name: 'Events'
    },
    {
      link: 'pleadings',
      name: 'Pleadings'
    },
    {
      link: 'docs',
      name: 'Docs'
    },
    {
      link: 'facts',
      name: 'Facts'
    }
  ];
  activeMenu = this.rightSideMenu[0];

  private errorSubscription: Subscription;

  constructor(public auth: AuthService,
              private scrollToService: ScrollToService,
              private router: Router,
              public route: ActivatedRoute,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher,
              private store: Store<fromStore.DisputeState>,
              private networkService: NetworkService,
              private routerService: RouterService) {
    super(route);
    this.error$ = this.store.pipe(select(fromStore.selectPersonError));
    this.dispute$ = this.store.pipe(select(fromStore.selectCurrentDispute));
    this.loading$ = this.store.pipe(select(fromStore.selectPeopleLoading));
    this.people$ = this.store.pipe(select(fromStore.selectPeopleByDispute));
    this.isExistsPerson$ = this.store.pipe(select(fromStore.checkIfPeopleExistedForSelectedDispute));
    this.personDetail$ = this.store.pipe(select(fromStore.selectPersonDetailData));
    this.activatedRoute$ = this.store.pipe(select(selectActivatedRoute));
    this.store.dispatch(new fromStore.ResetPeopleError());

    this.getActiveMenu();
  }

  getActiveMenu() {
    this.routerService.rightPanelPath$.subscribe((path) => {
      if (path) {
        const name = path.split('/')[0];
        this.activeMenu = {
          name: name,
          link: path
        };
      }
    });
  }

  ngOnInit() {
    this.errorSubscription = this.error$.subscribe((error) => {
      if (error) {
        const message = !this.networkService.isOnline.value ? `Couldn't refresh data while offline` : error.message;
        const snackBarRef = this.snackBar.open(message, 'Retry', {duration: 10000});
        if (error.failedAction) {
          snackBarRef.onAction().subscribe(() => {
            this.store.dispatch(error.failedAction);
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    this.store.dispatch(new fromStore.UserLeftPeoplePage());
  }

  onCreateBtnClick() {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Create Person',
        placeholder: 'Person Name',
        okButtonText: 'Create'
      }
    });

    dialogRef.afterClosed().pipe(
      withLatestFrom(this.activatedRoute$)
    ).subscribe(([result, route]) => {
      if (result.text) {
        const person: Person = {
          id: uuid(),
          name: result.text,
          disputeId: route.params.disputeId
        };
        this.store.dispatch(new fromStore.CreatePerson(person));
        this.scrollToPersonElement(person.id);
      }
    });
  }

  onDeleteClicked(person: Person): void {
    if (!person) {
      return;
    }
    this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        title: 'Delete ' + person.name + '?',
        message: 'Are you sure you want to delete this person?'
      }
    }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          const deletePersonModel: DeletePersonModel = {
            personId: person.id,
            disputeId: person.disputeId
          };
          this.store.dispatch(new fromStore.RemovePerson(deletePersonModel));
          if (this.selectedPerson && this.selectedPerson.id === person.id) {
            this.selectedPerson = null;
            this.store.dispatch(new fromStore.BackToListPeople());
          }
        }
      });
  }

  onRenameClicked(person: Person): void {
    if (!person) {
      return;
    }
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        text: person.name,
        title: 'Rename Person',
        placeholder: 'Person Name',
        okButtonText: 'Rename'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.text && result.text !== person.name) {
        const updatePerson = _.cloneDeep(person);
        updatePerson.name = result.text;
        this.store.dispatch(new fromStore.UpdatePerson(updatePerson));
        if (this.selectedPerson && this.selectedPerson.id === person.id) {
          this.store.dispatch(new fromStore.SelectPerson(updatePerson));
        }
      }
    });
  }

  onPersonClicked(person: Person): void {
    this.selectedPerson = person;
    this.store.dispatch(new fromStore.SelectPerson(person));
    this.scrollTopDocumentElement();
  }

  onSelectMenu(item: RightSideMenu) {
    this.activeMenu = item;
    this.router.navigate([item.link], {
      relativeTo: this.route
    });
  }

  private scrollToPersonElement(personId: string) {
    const scrollToConfig: ScrollToConfigOptions = {
      container: 'person-list',
      target: `person-${personId}`
    };
    if (scrollToConfig) {
      setTimeout(() => {
        this.scrollToService.scrollTo(scrollToConfig);
      }, 300);
    }
  }

  private scrollTopDocumentElement() {
    const scrollToConfig: ScrollToConfigOptions = {
      container: 'document-of-person',
      target: `top-document-of-person`,
      duration: 300
    };
    if (scrollToConfig) {
      this.scrollToService.scrollTo(scrollToConfig);
    }
  }
}
