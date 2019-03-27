import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';

import { empty, Observable } from 'rxjs';

import { TestingModule } from 'testing/utils';
import { PeopleEffects } from './people.effect';
import { PeopleService } from '../../services';
import * as fromPeopleActions from '../actions/people.action';
import { DeletePersonModel, Person } from '../../models';

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('PeopleEffects', () => {
  let actions$: TestActions;
  let effects: PeopleEffects;
  let service: PeopleService;

  const person = {
    disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
    id: '653ada50-acf5-4a52-a283-24b9c86325b1',
    name: 'Joe Bloggs'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        PeopleEffects,
        { provide: PeopleService, useValue: {} },
        { provide: Actions, useFactory: getActions }
      ]
    });

    effects = TestBed.get(PeopleEffects);
    actions$ = TestBed.get(Actions);
    service = TestBed.get(PeopleService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('createPerson$', () => {
    it('should return a peopleActions.CreatePersonSuccess on success', () => {
      const action = new fromPeopleActions.CreatePerson(person);
      const completion = new fromPeopleActions.CreatePersonSuccess({} as any);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: {} as any });
      const expected = cold('--c', { c: completion });
      service.createPerson = jasmine.createSpy('createPerson').and.returnValue(response);

      expect(effects.createPerson$).toBeObservable(expected);
      expect(service.createPerson).toHaveBeenCalled();
    });

    it('should return a peopleActions.CreatePersonFail with error when error', () => {
      const action = new fromPeopleActions.CreatePerson(person);
      const completion = new fromPeopleActions.CreatePersonFail({
        failedAction: action
      });
      const error = 'Error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });

      service.createPerson = jasmine.createSpy('createPerson').and.returnValue(response);
      expect(effects.createPerson$).toBeObservable(expected);
    });

  });

  describe('updatePerson$', () => {

    it('should return a peopleActions.UpdatePersonSuccess when success', () => {
      const action = new fromPeopleActions.UpdatePerson(person);
      const completion = new fromPeopleActions.UpdatePersonSuccess(true);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: true });
      const expected = cold('--c', { c: completion });
      service.renamePerson = jasmine.createSpy('renamePerson').and.returnValue(response);

      expect(effects.updatePerson$).toBeObservable(expected);
      expect(service.renamePerson).toHaveBeenCalledWith(person);
    });

    it('should return a peopleActions.UpdatePersonFail with error when error', () => {
      const action = new fromPeopleActions.UpdatePerson(person);
      const completion = new fromPeopleActions.UpdatePersonFail({
        failedAction: action
      });
      const error = 'Error!';
      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });

      service.renamePerson = jasmine.createSpy('renamePerson').and.returnValue(response);
      expect(effects.updatePerson$).toBeObservable(expected);
    });

  });

  describe('removePerson$', () => {

    const deletePersonModel: DeletePersonModel = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      personId: '653ada50-acf5-4a52-a283-24b9c86325b1'
    };

    it('should return a peopleActions.RemovePersonSuccess when success', () => {
      const action = new fromPeopleActions.RemovePerson(deletePersonModel);
      const completion = new fromPeopleActions.RemovePersonSuccess(true);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: true });
      const expected = cold('--c', { c: completion });
      service.removePerson = jasmine.createSpy('removePerson').and.returnValue(response);

      expect(effects.removePerson$).toBeObservable(expected);
      expect(service.removePerson).toHaveBeenCalledWith(deletePersonModel);
    });

    it('should return a peopleActions.RemovePersonFail with error when deletePerson error', () => {
      const action = new fromPeopleActions.RemovePerson(deletePersonModel);
      const completion = new fromPeopleActions.RemovePersonFail({
        failedAction: action
      });
      const error = 'Error!';
      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });

      service.removePerson = jasmine.createSpy('removePerson').and.returnValue(response);
      expect(effects.removePerson$).toBeObservable(expected);
    });

  });

  describe('loadPeople$', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';

    it('should return a peopleActions.LoadPeopleSuccess, on success', () => {
      const people: Array<Person> = [
        {
          id: '27f11786-a3f0-4328-9f6a-88c762db7a34',
          name: 'John Smith',
          documentIds: []
        }, {
          id: '27f11786-a3f0-4328-9f6a-88c762db7b32',
          name: 'John',
          documentIds: ['123e2321', '32132131']
        }];
      const listPeople = people.map(item => {
        return {
          ...item,
          disputeId: disputeId
        };
      });

      const updateListPeople = {
        disputeIdOfPeopleEntries: disputeId,
        people: listPeople
      };
      const action = new fromPeopleActions.LoadPeople({ disputeId });
      const completion = new fromPeopleActions.LoadPeopleSuccess(updateListPeople);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: people });
      const expected = cold('--c', { c: completion });
      service.getPeopleByDispute = jasmine.createSpy('getPeopleByDispute').and.returnValue(response);

      expect(effects.loadPeople$).toBeObservable(expected);
      expect(service.getPeopleByDispute).toHaveBeenCalledWith(disputeId);
    });

    it('should return a peopleActions.LoadPeopleFail, if the service throws error', () => {
      const action = new fromPeopleActions.LoadPeople({ disputeId });
      const error = 'Error!';
      const completion = new fromPeopleActions.LoadPeopleFail({
        failedAction: action
      });

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });

      service.getPeopleByDispute = jasmine.createSpy('getPeopleByDispute').and.returnValue(response);

      expect(effects.loadPeople$).toBeObservable(expected);
    });

  });

});
