import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment as env } from '@app/env';
import { Dispute, UpdateDisputeModel } from '../models';

@Injectable()
export class DisputesService {
  constructor(private http: HttpClient) {
  }

  getDisputes(): Observable<Dispute[]> {
    return this.http.get<Dispute[]>(`${env.server.apiBaseUrl}/qry/FindDisputesByUser`);
  }

  createDispute(payload: Dispute): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/CreateDispute`, payload);
  }

  updateDispute(payload: UpdateDisputeModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/RenameDispute`, payload);
  }

  removeDispute(dispute: Dispute): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/DeleteDispute`, {DisputeId: dispute.id});
  }
}
