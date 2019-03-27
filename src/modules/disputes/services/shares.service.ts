import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment as env } from '@app/env';
import {
  CreateShareDisputeModel,
  DeleteShareDisputeModel,
  ShareDisputeModel
} from '../models';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class SharesService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  public getSharesByDispute(id: string): Observable<Array<ShareDisputeModel>> {
    return this.http.get<Array<ShareDisputeModel>>(`${env.server.apiBaseUrl}/qry/FindDisputeSharesByDispute/${id}`);
  }

  public createShare(payload: CreateShareDisputeModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/CreateDisputeInvite`, payload);
  }

  public removeShare(payload: DeleteShareDisputeModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/RemoveDisputeShare`, payload);
  }

  public acceptDisputeInvite(inviteId): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/AcceptDisputeInvite`,
      {
        id: inviteId,
        userName: this.authService.getUserName()
      });
  }
}
