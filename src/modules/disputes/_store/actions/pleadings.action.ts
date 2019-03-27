import { Action } from '@ngrx/store';

import { Error } from 'modules/app/_store';
import { Pleading, Response } from '../../models';
import * as actionTypes from './pleading-action-type';
import { AssignSentenceToIssueModel, ParagraphOrderingModel } from '../../models';

export class LoadParagraphs implements Action {
  readonly type = actionTypes.LOAD_PARAGRAPHS;

  constructor(public payload: { disputeId: string }) {
  }
}

export class LoadParagraphsSilent implements Action {
  readonly type = actionTypes.LOAD_PARAGRAPHS_SILENT;

  constructor(public payload: { disputeId: string }) {
  }
}

export class LoadParagraphsSuccess implements Action {
  readonly type = actionTypes.LOAD_PARAGRAPHS_SUCCESS;

  constructor(public payload: { disputeIdOfEntries: string, paragraphs: Array<Pleading> }) {
  }
}

export class LoadParagraphsFail implements Action {
  readonly type = actionTypes.LOAD_PARAGRAPHS_FAIL;

  constructor(public payload: Error) {
  }
}

export class CreateParagraph implements Action {
  readonly type = actionTypes.CREATE_PARAGRAPH;

  constructor(public payload: Pleading) {
  }
}

export class CreateParagraphSuccess implements Action {
  readonly type = actionTypes.CREATE_PARAGRAPH_SUCCESS;

  constructor(public payload: Pleading) {
  }
}

export class CreateParagraphFail implements Action {
  readonly type = actionTypes.CREATE_PARAGRAPH_FAIL;

  constructor(public payload?: Error) {
  }
}

export class AddParagraphSentences implements Action {
  readonly type = actionTypes.ADD_PARAGRAPH_SENTENCES;

  constructor(public payload: any) {
  }
}

export class AddParagraphSentencesSuccess implements Action {
  readonly type = actionTypes.ADD_PARAGRAPH_SENTENCES_SUCCESS;

  constructor(public payload: any) {
  }
}

export class AddParagraphSentencesFail implements Action {
  readonly type = actionTypes.ADD_PARAGRAPH_SENTENCES_FAIL;

  constructor(public payload: Error) {
  }
}

export class UpdateParagraph implements Action {
  readonly type = actionTypes.UPDATE_PARAGRAPH;

  constructor(public payload: Pleading) {
  }
}

export class UpdateParagraphSuccess implements Action {
  readonly type = actionTypes.UPDATE_PARAGRAPH_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateParagraphFail implements Action {
  readonly type = actionTypes.UPDATE_PARAGRAPH_FAIL;

  constructor(public payload: Error) {
  }
}

export class RemoveParagraph implements Action {
  readonly type = actionTypes.REMOVE_PARAGRAPH;

  constructor(public payload: Pleading) {
  }
}

export class RemoveParagraphSuccess implements Action {
  readonly type = actionTypes.REMOVE_PARAGRAPH_SUCCESS;

  constructor(public payload: Pleading) {
  }
}

export class RemoveParagraphFail implements Action {
  readonly type = actionTypes.REMOVE_PARAGRAPH_FAIL;

  constructor(public payload: Error) {
  }
}

export class CreateResponse implements Action {
  readonly type = actionTypes.CREATE_RESPONSE;

  constructor(public payload: any) {

  }
}

export class CreateResponseSuccess implements Action {
  readonly type = actionTypes.CREATE_RESPONSE_SUCCESS;

  constructor(public payload: Pleading) {
  }
}

export class CreateResponseFail implements Action {
  readonly type = actionTypes.CREATE_RESPONSE_FAIL;

  constructor(public payload?: Error) {
  }
}

export class RemoveResponse implements Action {
  readonly type = actionTypes.REMOVE_RESPONSE;

  constructor(public payload: Response) {
  }
}

export class RemoveResponseSuccess implements Action {
  readonly type = actionTypes.REMOVE_RESPONSE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class RemoveResponseFail implements Action {
  readonly type = actionTypes.REMOVE_RESPONSE_FAIL;

  constructor(public payload: Error) {
  }
}

export class UpdateResponse implements Action {
  readonly type = actionTypes.UPDATE_RESPONSE;

  constructor(public payload: Response) {
  }
}

export class UpdateResponseSuccess implements Action {
  readonly type = actionTypes.UPDATE_RESPONSE_SUCCESS;

  constructor(public payload?: { response: { id: string, changes: Response } }) {
  }
}

export class UpdateResponseFail implements Action {
  readonly type = actionTypes.UPDATE_RESPONSE_FAIL;

  constructor(public payload: Error) {
  }
}

export class AddResponseSentences implements Action {
  readonly type = actionTypes.ADD_RESPONSE_SENTENCES;

  constructor(public payload: any) {
  }
}

export class AddResponseSentencesSuccess implements Action {
  readonly type = actionTypes.ADD_RESPONSE_SENTENCES_SUCCESS;

  constructor(public payload: any) {
  }
}

export class AddResponseSentencesFail implements Action {
  readonly type = actionTypes.ADD_RESPONSE_SENTENCES_FAIL;

  constructor(public payload: Error) {
  }
}

export class UpdateSentence implements Action {
  readonly type = actionTypes.UPDATE_SENTENCE;

  constructor(public payload: any) {
  }
}

export class UpdateSentenceSuccess implements Action {
  readonly type = actionTypes.UPDATE_SENTENCE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateSentenceFail implements Action {
  readonly type = actionTypes.UPDATE_SENTENCE_FAIL;

  constructor(public payload: Error) {
  }
}

export class RemoveSentence implements Action {
  readonly type = actionTypes.REMOVE_SENTENCE;

  constructor(public payload: any) {
  }
}

export class RemoveSentenceSuccess implements Action {
  readonly type = actionTypes.REMOVE_SENTENCE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class RemoveSentenceFail implements Action {
  readonly type = actionTypes.REMOVE_SENTENCE_FAIL;

  constructor(public payload: Error) {
  }
}

export class AssignSentenceToIssue implements Action {
  readonly type = actionTypes.ASSIGN_SENTENCE_TO_ISSUE;

  constructor(public payload: any) {

  }
}

export class AssignSentenceToIssueSuccess implements Action {
  readonly type = actionTypes.ASSIGN_SENTENCE_TO_ISSUE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class AssignSentenceToIssueFail implements Action {
  readonly type = actionTypes.ASSIGN_SENTENCE_TO_ISSUE_FAIL;

  constructor(public payload: Error) {
  }
}

export class RemoveSentencesFromIssue implements Action {
  readonly type = actionTypes.REMOVE_SENTENCES_FROM_ISSUE;

  constructor(public payload: AssignSentenceToIssueModel) {
  }
}

export class RemoveSentencesFromIssueSuccess implements Action {
  readonly type = actionTypes.REMOVE_SENTENCES_FROM_ISSUE_SUCCESS;
}

export class RemoveSentencesFromIssueFail implements Action {
  readonly type = actionTypes.REMOVE_SENTENCES_FROM_ISSUE_FAIL;

  constructor(public payload: Error) {
  }
}

export class SetParagraphOrder implements Action {
  readonly type = actionTypes.SET_PARAGRAPH_ORDER;

  constructor(public payload: ParagraphOrderingModel) {

  }
}

export class SetParagraphOrderSuccess implements Action {
  readonly type = actionTypes.SET_PARAGRAPH_ORDER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class SetParagraphOrderFail implements Action {
  readonly type = actionTypes.SET_PARAGRAPH_ORDER_FAIL;

  constructor(public payload: Error) {
  }
}

export type PleadingsAction =
  | LoadParagraphs | LoadParagraphsFail | LoadParagraphsSuccess | LoadParagraphsSilent
  | CreateParagraph | CreateParagraphFail | CreateParagraphSuccess
  | UpdateParagraph | UpdateParagraphFail | UpdateParagraphSuccess
  | RemoveParagraph | RemoveParagraphFail | RemoveParagraphSuccess
  | CreateResponse | CreateResponseFail | CreateResponseSuccess
  | RemoveResponse | RemoveResponseFail | RemoveResponseSuccess
  | UpdateResponse | UpdateResponseFail | UpdateResponseSuccess
  | AddResponseSentences | AddResponseSentencesFail | AddResponseSentencesSuccess
  | UpdateSentence | UpdateSentenceFail | UpdateSentenceSuccess
  | RemoveSentence | RemoveSentenceFail | RemoveSentenceSuccess
  | AddParagraphSentences | AddParagraphSentencesFail | AddParagraphSentencesSuccess
  | AssignSentenceToIssue | AssignSentenceToIssueFail | AssignSentenceToIssueSuccess
  | RemoveSentencesFromIssue | RemoveSentencesFromIssueFail | RemoveSentencesFromIssueSuccess
  | SetParagraphOrder | SetParagraphOrderFail | SetParagraphOrderSuccess;
