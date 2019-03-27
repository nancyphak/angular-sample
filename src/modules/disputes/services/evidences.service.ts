import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment as env } from '@app/env';
import { CreateEvidenceModel, Evidence } from '../models';

@Injectable()
export class EvidencesService {
  constructor(private http: HttpClient) {
  }

  createEvidence(evidence: CreateEvidenceModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/CreateEvidence`, evidence);
  }

  getEvidencesByDispute(disputeId: string): Observable<any> {
    return this.http.get<any>(`${env.server.apiBaseUrl}/qry/FindEvidenceByDispute/${disputeId}`);
  }

  removeEvidence(evidence: Evidence): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/DeleteEvidence`, {
      EvidenceId: evidence.id,
      DisputeId: evidence.disputeId
    });
  }

  updateEvidence(evidence: Evidence): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/UpdateEvidence`, {
      EvidenceId: evidence.id,
      Text: evidence.text,
      PageNumber: evidence.pageNumber,
      DocumentId: evidence.documentId,
      IssueIds: evidence.issueIds,
      DisputeId: evidence.disputeId
    });
  }
}
