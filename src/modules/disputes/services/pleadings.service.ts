import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment as env } from '@app/env';
import {
  AddParagraphSentencesModel,
  AddResponseSentencesModel,
  ParagraphOrderingModel,
  Pleading,
  RemoveSentenceModel,
  Response,
  UpdateSentenceModel
} from '../models';

@Injectable()
export class PleadingsService {

  constructor(private http: HttpClient) {
  }

  public getParagraphsByDispute(id: string): Observable<Array<Pleading>> {
    return this.http.get<Array<Pleading>>(`${env.server.apiBaseUrl}/qry/FindParagraphsByDispute/${id}`);
  }

  public createParagraph(pleading: Pleading): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/CreateParagraph`, pleading);
  }

  public updateParagraph(pleading: Pleading): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/RenameParagraph`, {
      id: pleading.id,
      disputeId: pleading.disputeId,
      newTitle: pleading.title
    });
  }

  public removeParagraph(pleading: Pleading): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/DeleteParagraph`, {
      disputeId: pleading.disputeId,
      id: pleading.id
    });
  }

  public createResponse(response: Response): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/CreateResponse`, {
      disputeId: response.disputeId,
      paragraphId: response.paragraphId,
      id: response.id,
      title: response.title,
    });
  }

  public removeResponse(response: Response): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/DeleteResponse`, {
      disputeId: response.disputeId,
      paragraphId: response.paragraphId,
      id: response.id
    });
  }

  public updateResponse(response: Response): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/RenameResponse`, {
      id: response.id,
      disputeId: response.disputeId,
      paragraphId: response.paragraphId,
      newTitle: response.title
    });
  }

  public assignSentenceToIssue(sentence): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/AddIssueIdsToSentence`, {
      disputeId: sentence.disputeId,
      sentenceId: sentence.sentenceId,
      issueIds: sentence.issueIds
    });
  }

  public removeIssueIdsFromSentence(model): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/RemoveSentencesFromIssue`, {
      disputeId: model.disputeId,
      issueId: model.issueId,
      sentenceIds: model.sentenceIds
    });
  }

  public addParagraphSentences(sentences: AddParagraphSentencesModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/AddParagraphSentences`, sentences);
  }

  public addResponseSentences(response: AddResponseSentencesModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/AddResponseSentences`, response);
  }

  public updateSentence(updateSentence: UpdateSentenceModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/UpdateSentenceText`, updateSentence);
  }

  public removeSentence(removeSentence: RemoveSentenceModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/DeleteSentence`, removeSentence);
  }

  public splitSentence(text: string): Observable<any> {
    const data = { text: text };
    return this.http.post(`${env.server.apiBaseUrl}/svc/SplitSentence`, data);
  }

  setParagraphOrdering(data: ParagraphOrderingModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/SetParagraphOrder`, data);
  }
}
