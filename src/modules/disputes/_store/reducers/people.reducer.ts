import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Error } from 'modules/app/_store';
import { DocumentModel, Person, SetDocumentPeopleModel } from '../../models';
import * as fromPeople from '../actions/people.action';
import * as _ from 'lodash';
import * as documentActionTypes from '../actions/document-action-type';
import * as fromDocumentActions from '../actions/documents.action';
import * as actionTypes from '../actions/person-action-type';

export interface State extends EntityState<Person> {
  disputeIdOfPeopleEntries: string;
  selectedPerson: Person;
  loaded: boolean;
  loading: boolean;
  error: Error;
}

export function sortByIndex(a: Person, b: Person): number {
  return a.index - b.index;
}

export const adapter: EntityAdapter<Person> = createEntityAdapter<Person>({
  sortComparer: sortByIndex
});

export const initialState = adapter.getInitialState({
  disputeIdOfPeopleEntries: '',
  selectedPerson: null,
  loaded: false,
  loading: false,
  error: null
});

const errorMessage = 'Sorry, some thing is wrong...';

export function reducer(state = initialState, action: fromPeople.PeopleAction | fromDocumentActions.DocumentActions): State {
  switch (action.type) {

    case actionTypes.LOAD_PEOPLE: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case actionTypes.LOAD_PEOPLE_SUCCESS: {
      const people = _.cloneDeep(action.payload.people);
      people.forEach((person: Person, index: number) => person.index = index);
      return adapter.upsertMany(people, {
        ...state,
        disputeIdOfPeopleEntries: action.payload.disputeIdOfPeopleEntries,
        loading: false,
        loaded: true,
        error: null
      });
    }

    case actionTypes.LOAD_PEOPLE_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.CREATE_PERSON: {
      const person: Person = {
        ...action.payload,
        documentIds: []
      };
      const people = Object.keys(state.entities).map(id => _.cloneDeep(state.entities[id]));
      people.unshift(person);
      people.forEach((x, index) => {
        x.index = index;
      });

      return adapter.addAll(people, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.CREATE_PERSON_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.CREATE_PERSON_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.UPDATE_PERSON: {
      const person = action.payload;
      return adapter.updateOne({id: person.id, changes: person}, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.UPDATE_PERSON_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.UPDATE_PERSON_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.REMOVE_PERSON: {
      return adapter.removeOne(action.payload.personId, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.REMOVE_PERSON_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.REMOVE_PERSON_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.SET_DOCUMENT_PEOPLE: {
      const entities = _.cloneDeep(state.entities);
      const people = Object.keys(entities).map(id => entities[id]);
      const setDocumentPeopleModel: SetDocumentPeopleModel = action.payload;

      people.forEach((person: Person) => {
        if (!(setDocumentPeopleModel.peopleIds.some(personId => personId === person.id))) {
          person.documentIds = person.documentIds.filter(docId => docId !== setDocumentPeopleModel.documentId);
        } else {
          if (person.documentIds && person.documentIds.indexOf(setDocumentPeopleModel.documentId) < 0) {
            person.documentIds.push(setDocumentPeopleModel.documentId);
          }
        }
      });

      const updates = people.map((person) => {
        return {
          id: person.id,
          changes: person
        };
      });

      return adapter.updateMany(updates, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.SET_DOCUMENT_PEOPLE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.SET_DOCUMENT_PEOPLE_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.RESET_PEOPLE_ERROR: {
      return {
        ...state,
        error: null
      };
    }

    case actionTypes.SELECT_PERSON: {
      return {
        ...state,
        selectedPerson: action.payload
      };
    }

    case actionTypes.PERSON_DETAIL: {
      return {
        ...state,
        selectedPerson: action.payload
      };
    }

    case actionTypes.USER_LEFT_PEOPLE_PAGE: {
      return {
        ...state,
        selectedPerson: null
      };
    }

    case actionTypes.BACK_TO_LIST_PEOPLE: {
      return {
        ...state,
        selectedPerson: null
      };
    }

    case documentActionTypes.DELETE_DOCUMENT_SUCCESS: {
      const deletedDocument: DocumentModel = action.payload;
      const entities = _.cloneDeep(state.entities);
      let people: Array<Person> = Object.keys(entities).map(id => entities[id]);
      people = people.filter((person: Person) => {
        return person.documentIds.some((id) => id === deletedDocument.id);
      });

      people.forEach((person: Person) => {
        person.documentIds = person.documentIds.filter(id => id !== deletedDocument.id);
      });

      const update = people.map((person: Person) => {
        return {
          id: person.id,
          changes: person
        };
      });
      return adapter.updateMany(update, {
        ...state,
        loading: false
      });
    }

    default: {
      return state;
    }
  }
}

export const getPeopleLoading = (state: State) => state.loading;
export const getPeopleLoaded = (state: State) => state.loaded;
export const getError = (state: State) => state.error;
export const getSelectedPerson = (state: State) => state.selectedPerson;
export const getDisputeIdOfPeopleEntries = (state: State) => state.disputeIdOfPeopleEntries;

