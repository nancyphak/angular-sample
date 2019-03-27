import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment as env } from '@app/env';
import { DeletePersonModel, Person, SetDocumentPeopleModel } from '../models';

@Injectable()
export class PeopleService {

  constructor(private http: HttpClient) {
  }

  public getPeopleByDispute(id: string): Observable<Array<Person>> {
    return this.http.get<Array<Person>>(`${env.server.apiBaseUrl}/qry/FindPeopleByDispute/${id}`);
  }

  public createPerson(person: Person): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/CreatePerson`, person);
  }

  public renamePerson(person: Person): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/RenamePerson`, {
      disputeId: person.disputeId,
      personId: person.id,
      newName: person.name
    });
  }

  public removePerson(deletePersonModel: DeletePersonModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/DeletePerson`, deletePersonModel);
  }

  public setDocumentPerson(documentModel: SetDocumentPeopleModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/SetDocumentPeople`, documentModel);
  }
}
