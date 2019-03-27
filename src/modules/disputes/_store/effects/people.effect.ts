import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, timer } from 'rxjs';
import { catchError, map, switchMap, mapTo, withLatestFrom, filter } from 'rxjs/operators';

import { appConfig } from '@app/config';
import { Undo, getRouterState } from 'modules/app/_store';
import { Person } from '../../models';
import * as peopleActions from '../actions/people.action';
import { PeopleService } from '../../services';
import * as actionTypes from '../actions/person-action-type';
import * as fromStore from '../index';

@Injectable()
export class PeopleEffects {
  constructor(private actions$: Actions,
    private store: Store<fromStore.DisputeState>,
    private peopleService: PeopleService) {
  }

  @Effect()
  loadPeople$ = this.actions$.pipe(
    ofType(actionTypes.LOAD_PEOPLE, actionTypes.LOAD_PEOPLE_SILENT),
    map((action: peopleActions.LoadPeople) => action),
    switchMap((action) => {
      return this.peopleService
        .getPeopleByDispute(action.payload.disputeId)
        .pipe(
          map((people) => {
            let peopleArray: Array<Person> = [];
            if (people && people.length > 0) {
              peopleArray = people.map(e => {
                return { ...e, disputeId: action.payload.disputeId };
              });
            }
            return new peopleActions.LoadPeopleSuccess({
              disputeIdOfPeopleEntries: action.payload.disputeId,
              people: peopleArray
            });
          }),
          catchError(() => of(new peopleActions.LoadPeopleFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  onLoadPeopleSuccess$ = this.actions$.pipe(
    ofType(actionTypes.LOAD_PEOPLE_SUCCESS),
    map((action: peopleActions.LoadPeopleSuccess) => action.payload),
    switchMap((payload) => {
      return timer(appConfig.getDataSilentTimer).pipe(
        mapTo(payload.disputeIdOfPeopleEntries)
      );
    }),
    withLatestFrom(this.store.pipe(select(getRouterState))),
    filter(([disputeId, routerState]) => {
      return routerState.state.url.includes(disputeId);
    }),
    map(([disputeId]) => {
      return new peopleActions.LoadPeopleSilent({ disputeId });
    })
  );

  @Effect()
  createPerson$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_PERSON),
    map((action: peopleActions.CreatePerson) => action),
    switchMap(action => {
      return this.peopleService
        .createPerson(action.payload)
        .pipe(
          map((res) => new peopleActions.CreatePersonSuccess(res)),
          catchError(() => of(new peopleActions.CreatePersonFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  updatePerson$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_PERSON),
    map((action: peopleActions.UpdatePerson) => action),
    switchMap(action => {
      return this.peopleService
        .renamePerson(action.payload)
        .pipe(
          map((res) => new peopleActions.UpdatePersonSuccess(res)),
          catchError(() => of(new peopleActions.UpdatePersonFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  removePerson$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_PERSON),
    map((action: peopleActions.RemovePerson) => action),
    switchMap(action => {
      return this.peopleService
        .removePerson(action.payload)
        .pipe(
          map((res) => new peopleActions.RemovePersonSuccess(res)),
          catchError(() => of(new peopleActions.RemovePersonFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  setDocumentPeople$ = this.actions$.pipe(
    ofType(actionTypes.SET_DOCUMENT_PEOPLE),
    map((action: peopleActions.SetDocumentPeople) => action),
    switchMap(action => {
      return this.peopleService
        .setDocumentPerson(action.payload)
        .pipe(
          map((res) => new peopleActions.SetDocumentPeopleSuccess(res)),
          catchError(() => of(new peopleActions.SetDocumentPeopleFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  handleCreateError$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_PERSON_FAIL),
    map(() => new Undo(actionTypes.CREATE_PERSON))
  );

  @Effect()
  handleUpdateError$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_PERSON_FAIL),
    map(() => new Undo(actionTypes.UPDATE_PERSON))
  );

  @Effect()
  handleDeleteError$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_PERSON_FAIL),
    map(() => new Undo(actionTypes.REMOVE_PERSON))
  );

  @Effect()
  handleSetDocumentPeopleError$ = this.actions$.pipe(
    ofType(actionTypes.SET_DOCUMENT_PEOPLE_FAIL),
    map(() => new Undo(actionTypes.SET_DOCUMENT_PEOPLE))
  );

}
