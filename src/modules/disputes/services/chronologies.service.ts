import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment as env } from '@app/env';
import { Chronology } from '../models';

@Injectable()
export class ChronologiesService {

  constructor(private http: HttpClient) {
  }

  public getChronologyEventsByDispute(disputeId: string): Observable<Array<Chronology>> {
    return this.http.get<Array<Chronology>>(`${env.server.apiBaseUrl}/qry/FindChronologyEventsByDispute/${disputeId}`);
  }

  public createChronologyEvent(chronology: Chronology): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/CreateChronologyEvent`, chronology);
  }

  public updateChronologyEvent(chronology: Chronology): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/UpdateChronologyEvent`, chronology);
  }

  public removeChronologyEvent(chronology): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/DeleteChronologyEvent`, {
      id: chronology.id,
      disputeId: chronology.disputeId
    });
  }

}
