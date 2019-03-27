import { Action } from '@ngrx/store';
import { Error } from 'modules/app/_store';
import { DeletePersonModel, Person, SetDocumentPeopleModel } from '../../models';
import * as actionTypes from './person-action-type';

export class LoadPeople implements Action {
  readonly type = actionTypes.LOAD_PEOPLE;

  constructor(public payload: { disputeId: string }) {
  }
}

export class LoadPeopleSilent implements Action {
  readonly type = actionTypes.LOAD_PEOPLE_SILENT;

  constructor(public payload: { disputeId: string }) {
  }
}

export class LoadPeopleSuccess implements Action {
  readonly type = actionTypes.LOAD_PEOPLE_SUCCESS;

  constructor(public payload: { disputeIdOfPeopleEntries: string, people: Array<Person> }) {
  }
}

export class LoadPeopleFail implements Action {
  readonly type = actionTypes.LOAD_PEOPLE_FAIL;

  constructor(public payload: Error) {
  }
}

export class CreatePerson implements Action {
  readonly type = actionTypes.CREATE_PERSON;

  constructor(public payload: Person) {
  }
}

export class CreatePersonSuccess implements Action {
  readonly type = actionTypes.CREATE_PERSON_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreatePersonFail implements Action {
  readonly type = actionTypes.CREATE_PERSON_FAIL;

  constructor(public payload?: Error) {
  }
}

export class UpdatePerson implements Action {
  readonly type = actionTypes.UPDATE_PERSON;

  constructor(public payload: any) {
  }
}

export class UpdatePersonSuccess implements Action {
  readonly type = actionTypes.UPDATE_PERSON_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdatePersonFail implements Action {
  readonly type = actionTypes.UPDATE_PERSON_FAIL;

  constructor(public payload?: Error) {
  }
}

export class RemovePerson implements Action {
  readonly type = actionTypes.REMOVE_PERSON;

  constructor(public payload: DeletePersonModel) {
  }
}

export class RemovePersonSuccess implements Action {
  readonly type = actionTypes.REMOVE_PERSON_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class RemovePersonFail implements Action {
  readonly type = actionTypes.REMOVE_PERSON_FAIL;

  constructor(public payload: Error) {
  }
}

export class SetDocumentPeople implements Action {
  readonly type = actionTypes.SET_DOCUMENT_PEOPLE;

  constructor(public payload: SetDocumentPeopleModel) {
  }
}

export class SetDocumentPeopleSuccess implements Action {
  readonly type = actionTypes.SET_DOCUMENT_PEOPLE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class SetDocumentPeopleFail implements Action {
  readonly type = actionTypes.SET_DOCUMENT_PEOPLE_FAIL;

  constructor(public payload?: any) {
  }
}

export class ResetPeopleError implements Action {
  readonly type = actionTypes.RESET_PEOPLE_ERROR;
}

export class SelectPerson implements Action {
  readonly type = actionTypes.SELECT_PERSON;

  constructor(public payload: Person) {

  }
}

export class PersonDetail implements Action {
  readonly type = actionTypes.PERSON_DETAIL;

  constructor(public payload: Person) {

  }
}

export class UserLeftPeoplePage implements Action {
  readonly type = actionTypes.USER_LEFT_PEOPLE_PAGE;
}

export class BackToListPeople implements Action {
  readonly type = actionTypes.BACK_TO_LIST_PEOPLE;
}

export type PeopleAction =
  | LoadPeople | LoadPeopleFail | LoadPeopleSuccess | LoadPeopleSilent
  | CreatePerson | CreatePersonFail | CreatePersonSuccess
  | UpdatePerson | UpdatePersonFail | UpdatePersonSuccess
  | RemovePerson | RemovePersonFail | RemovePersonSuccess
  | SetDocumentPeople | SetDocumentPeopleFail | SetDocumentPeopleSuccess
  | SelectPerson | UserLeftPeoplePage | BackToListPeople | PersonDetail
  | ResetPeopleError;
