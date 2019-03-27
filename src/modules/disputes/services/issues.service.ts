import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment as env } from '@app/env';
import {
  Issue,
  IssueOrderingModel,
  ResponseIssueModel, SetIssueNotesHeightModel,
  SetIssuePositionModel,
  UpdateIssueModel
} from '../models';

@Injectable()
export class IssuesService {
  constructor(private http: HttpClient) {
  }

  getIssues(disputeId: string): Observable<ResponseIssueModel[]> {
    return this.http.get<ResponseIssueModel[]>(`${env.server.apiBaseUrl}/qry/FindIssuesByDispute/${disputeId}`);
  }

  createIssue(issue: Issue): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/CreateIssue`, issue);
  }

  updateIssue(issue: UpdateIssueModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/RenameIssue`, issue);
  }

  removeIssue(issue: any): Observable<any> {
    const data = { Id: issue.id, DisputeId: issue.disputeId };
    return this.http.post(`${env.server.apiBaseUrl}/cmd/DeleteIssue`, data);
  }

  setIssueNotes(issue: Issue): Observable<any> {
    const data = {
      DisputeId: issue.disputeId,
      IssueId: issue.id,
      Notes: issue.notes
    };
    return this.http.post(`${env.server.apiBaseUrl}/cmd/SetIssueNotes`, data);
  }

  removeIssueNotes(issue: Issue): Observable<any> {
    const data = { IssueId: issue.id, DisputeId: issue.disputeId };
    return this.http.post(`${env.server.apiBaseUrl}/cmd/DeleteIssueNotes`, data);
  }

  setIssueOrdering(data: IssueOrderingModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/SetIssueOrder`, data);
  }

  setIssuePosition(data: SetIssuePositionModel): Observable<any> {
    if (data.afterIssueId === null || data.afterIssueId === undefined) {
      delete data.afterIssueId;
    }
    return this.http.post(`${env.server.apiBaseUrl}/cmd/SetIssuePosition`, data);
  }

  setIssueNotesHeight(data: SetIssueNotesHeightModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/SetIssueNotesHeightPreference`, data);
  }
}
