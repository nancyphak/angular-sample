export interface Pleading {
  disputeId?: string;
  id: string;
  title?: string;
  sentences?: Array<Sentence>;
  concatedSentences?: string;
  responses?: Array<Response>;
  index?: number;
}

export interface Response {
  disputeId: string;
  paragraphId: string;
  id: string;
  beforeSentenceId?: string;
  title?: string;
  sentences?: Array<Sentence>;
  concatedSentences?: string;
}

export interface Sentence {
  id: string;
  text: string;
  issueIds?: Array<string>;
}

export interface AddParagraphSentencesModel {
  disputeId: string;
  paragraphId: string;
  beforeSentenceId: string;
  sentences: Array<Sentence>;
}

export interface AddResponseSentencesModel {
  disputeId: string;
  paragraphId: string;
  responseId: string;
  sentences: Array<Sentence>;
  beforeSentenceId?: string;
}

export interface UpdateSentenceModel {
  disputeId: string;
  id: string;
  newText: string;
}

export interface RemoveSentenceModel {
  disputeId: string;
  id: string;
}

export interface ParagraphOrderingModel {
  disputeId: string;
  paragraphIds: string[];
}

export interface AssignSentenceToIssueModel {
  issueId: string;
  sentenceIds: Array<string>;
  sentence: Sentence;
  response: Response;
  paragraphId: string;
  disputeId: string;
}
