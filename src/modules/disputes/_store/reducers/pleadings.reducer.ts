import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as _ from 'lodash';

import * as actionTypes from '../actions/pleading-action-type';
import * as fromPleadings from '../actions/pleadings.action';
import { Error } from 'modules/app/_store';
import { AddParagraphSentencesModel, AddResponseSentencesModel, Pleading, Response, Sentence, } from '../../models';

export interface State extends EntityState<Pleading> {
  loaded: boolean;
  loading: boolean;
  error: Error;
  disputeIdOfEntries: string;
}

export function sortByIndex(a: Pleading, b: Pleading): number {
  return a.index - b.index;
}

export const adapter: EntityAdapter<Pleading> = createEntityAdapter<Pleading>({
  sortComparer: sortByIndex
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: null,
  disputeIdOfEntries: ''
});

export const errorMessage = 'Sorry, some thing is wrong...';

export function reducer(state = initialState, action: fromPleadings.PleadingsAction): State {
  switch (action.type) {
    case actionTypes.LOAD_PARAGRAPHS: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case actionTypes.LOAD_PARAGRAPHS_SUCCESS: {
      const paragraphs = _.cloneDeep(action.payload.paragraphs);
      const disputeIdOfEntries = action.payload.disputeIdOfEntries;
      paragraphs.forEach((paragraph: Pleading, index: number) => paragraph.index = index);
      return adapter.upsertMany(paragraphs, {
        ...state,
        disputeIdOfEntries: disputeIdOfEntries,
        loaded: true,
        loading: false,
        error: null
      });
    }

    case actionTypes.LOAD_PARAGRAPHS_FAIL: {
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

    case actionTypes.CREATE_PARAGRAPH: {
      const pleading: Pleading = {
        ...action.payload
      };
      const pleadings = Object.keys(state.entities).map(id => _.cloneDeep(state.entities[id]));
      pleadings.sort((a, b) => {
        return a.index - b.index;
      });
      pleadings.push(pleading);
      pleadings.forEach((x, index) => {
        x.index = index;
      });

      return adapter.addAll(pleadings, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.CREATE_PARAGRAPH_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.CREATE_PARAGRAPH_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.UPDATE_PARAGRAPH: {
      const paragraph = action.payload;
      return adapter.updateOne({id: paragraph.id, changes: paragraph}, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.UPDATE_PARAGRAPH_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.UPDATE_PARAGRAPH_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.REMOVE_PARAGRAPH: {
      return adapter.removeOne(action.payload.id, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.REMOVE_PARAGRAPH_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.REMOVE_PARAGRAPH_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.ADD_PARAGRAPH_SENTENCES: {
      const model: AddParagraphSentencesModel = action.payload;
      const pleading = _.cloneDeep(state.entities[model.paragraphId]);

      const beforeSentenceId = model.beforeSentenceId;
      const beforeSentenceIndex = pleading.sentences.findIndex((res => res.id === beforeSentenceId));

      if (beforeSentenceIndex >= 0) {
        pleading.sentences.splice(beforeSentenceIndex, 0, ...model.sentences);
      } else {
        pleading.sentences = pleading.sentences.concat(model.sentences);
      }

      return adapter.updateOne({id: pleading.id, changes: pleading}, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.ADD_PARAGRAPH_SENTENCES_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.ADD_PARAGRAPH_SENTENCES_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.CREATE_RESPONSE: {
      const response: Response = action.payload;
      const pleadingToUpdate = _.cloneDeep(state.entities[response.paragraphId]);
      pleadingToUpdate.responses.push(response);

      return adapter.updateOne({
        id: pleadingToUpdate.id,
        changes: pleadingToUpdate
      }, {
        ...state,
        loading: true,
      });
    }

    case actionTypes.CREATE_RESPONSE_SUCCESS: {
      return {
        ...state,
        loading: false
      };
    }

    case actionTypes.CREATE_RESPONSE_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.REMOVE_RESPONSE: {
      const pleading = _.cloneDeep(state.entities[action.payload.paragraphId]);
      if (pleading.responses && pleading.responses.length > 0) {
        pleading.responses = pleading.responses.filter((item) => item.id !== action.payload.id);
      }

      return adapter.updateOne({id: pleading.id, changes: pleading}, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.REMOVE_RESPONSE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.REMOVE_RESPONSE_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.UPDATE_RESPONSE: {
      const pleading = _.cloneDeep(state.entities[action.payload.paragraphId]);
      pleading.responses.forEach((response) => {
        if (response.id === action.payload.id) {
          response.title = action.payload.title;
        }
      });
      const update = {
        id: pleading.id,
        changes: {
          ...pleading,
          responses: pleading.responses
        }
      };
      return adapter.updateOne(update, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.UPDATE_RESPONSE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.UPDATE_RESPONSE_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.ADD_RESPONSE_SENTENCES: {
      const model: AddResponseSentencesModel = action.payload;
      const pleading = _.cloneDeep(state.entities[model.paragraphId]);
      const beforeSentenceId = model.beforeSentenceId;
      const index = pleading.responses.findIndex((res => res.id === model.responseId));

      if (index >= 0) {
        if (beforeSentenceId) {
          const beforeSentenceIndex = pleading.responses[index].sentences.findIndex((i => i.id === beforeSentenceId));
          pleading.responses[index].sentences.splice(beforeSentenceIndex, 0, ...model.sentences);
        } else {
          pleading.responses[index].sentences = pleading.responses[index].sentences.concat(model.sentences);
        }
      }

      return adapter.updateOne({id: pleading.id, changes: pleading}, {
        ...state,
        loading: true,
        error: null

      });
    }

    case actionTypes.ADD_RESPONSE_SENTENCES_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.ADD_RESPONSE_SENTENCES_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.UPDATE_SENTENCE: {
      const pleading = _.cloneDeep(state.entities[action.payload.paragraphId]);
      if (action.payload.responseId) {
        pleading.responses.forEach((res) => {
          if (res.id === action.payload.responseId) {
            res.sentences.forEach((sentence) => {
              if (sentence.id === action.payload.sentence.id) {
                sentence.text = action.payload.sentence.text;
              }
            });
          }
        });
      } else {
        pleading.sentences.forEach((sentence) => {
          if (sentence.id === action.payload.sentence.id) {
            sentence.text = action.payload.sentence.text;
          }
        });
      }

      const update = {
        id: pleading.id,
        changes: {...pleading}
      };
      return adapter.updateOne(update, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.UPDATE_SENTENCE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.UPDATE_SENTENCE_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.REMOVE_SENTENCE: {
      const model = action.payload;
      const pleading = _.cloneDeep(state.entities[model.paragraphId]);

      if (model.responseId) {
        const index = pleading.responses.findIndex((res => res.id === model.responseId));
        if (index >= 0) {
          pleading.responses[index].sentences = pleading.responses[index].sentences.filter((item) => item.id !== model.sentence.id);
        }
      } else {
        pleading.sentences = pleading.sentences.filter((item) => item.id !== model.sentence.id);
      }

      return adapter.updateOne({id: pleading.id, changes: pleading}, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.REMOVE_SENTENCE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.REMOVE_SENTENCE_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.ASSIGN_SENTENCE_TO_ISSUE: {
      const pleading = _.cloneDeep(state.entities[action.payload.paragraphId]);
      if (action.payload.response) {
        pleading.responses.forEach((res: Response) => {
          if (res.id === action.payload.response.id) {
            res.sentences.forEach((sentence: Sentence) => {
              if (sentence.id === action.payload.sentence.id) {
                sentence.issueIds = action.payload.sentence.issueIds;
              }
            });
          }
        });
      }
      if (action.payload.sentence) {
        pleading.sentences.forEach((sentence: Sentence) => {
          if (sentence.id === action.payload.sentence.id) {
            sentence.issueIds = action.payload.sentence.issueIds;
          }
        });
      }

      const update = {
        id: pleading.id,
        changes: {...pleading}
      };
      return adapter.updateOne(update, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.ASSIGN_SENTENCE_TO_ISSUE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.ASSIGN_SENTENCE_TO_ISSUE_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.REMOVE_SENTENCES_FROM_ISSUE: {
      const pleading = _.cloneDeep(state.entities[action.payload.paragraphId]);
      if (action.payload.response) {
        pleading.responses.forEach((res: Response) => {
          if (res.id === action.payload.response.id) {
            res.sentences.forEach((sentence: Sentence) => {
              if (sentence.id === action.payload.sentence.id) {
                sentence.issueIds = sentence.issueIds.filter(id => id !== action.payload.issueId);
              }
            });
          }
        });
      } else {
        const sentenceNeedUpdate = pleading.sentences.find(x => x.id === action.payload.sentence.id);
        sentenceNeedUpdate.issueIds = sentenceNeedUpdate.issueIds.filter(id => id !== action.payload.issueId);
      }

      const update = {
        id: pleading.id,
        changes: {...pleading}
      };
      return adapter.updateOne(update, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.REMOVE_SENTENCES_FROM_ISSUE_SUCCESS : {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.REMOVE_SENTENCES_FROM_ISSUE_FAIL : {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.SET_PARAGRAPH_ORDER: {
      const paragraphIds = action.payload.paragraphIds;
      const newEntities = _.cloneDeep(state.entities);

      paragraphIds.forEach((id, index) => {
        newEntities[id].index = index;
      });

      const updates = Object.keys(newEntities).map(id => {
        return {
          id: id,
          changes: newEntities[id]
        };
      });

      return adapter.updateMany(updates, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.SET_PARAGRAPH_ORDER_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    default: {
      return state;
    }
  }
}

export const getPleadingsLoading = (state: State) => state.loading;
export const getPleadingsLoaded = (state: State) => state.loaded;
export const getError = (state: State) => state.error;
export const getParagraphIds = (state: State) => state.ids;
export const getDisputeIdOfEntries = (state: State) => state.disputeIdOfEntries;

