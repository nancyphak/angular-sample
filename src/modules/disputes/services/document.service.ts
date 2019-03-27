import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment as env } from '@app/env';
import {
  DeleteDocumentModel,
  DocumentMetadata,
  DocumentMetadataResponse,
  RenameDocumentModel
} from '../models';

@Injectable()
export class DocumentService {

  constructor(private http: HttpClient) {
  }

  public getDocumentMetadataByDispute(disputeId: string): Observable<Array<DocumentMetadataResponse>> {
    const url = `${env.server.apiBaseUrl}/qry/FindDocumentMetadataByDispute/${disputeId}`;
    return this.http.get<Array<DocumentMetadataResponse>>(url);
  }

  public setDocumentMetadata(metadata: DocumentMetadata) {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/SetDocumentMetadata`, metadata);
  }

  public getDocumentsByDispute(disputeId: string): Observable<any> {
    const url = `${env.server.apiBaseUrl}/documents/ListDocumentFiles/${disputeId}`;
    return this.http.get<Array<any>>(url);
  }

  public deleteDocumentInHouse(document: DeleteDocumentModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/DeleteDocument`, document);
  }

  public renameDocument(document: RenameDocumentModel): Observable<any> {
    return this.http.post(`${env.server.apiBaseUrl}/cmd/RenameDocument`, document);
  }

  public getDownloadDocumentUrl(disputeId: string, documentId: string): Observable<any> {
    return this.http.get<any>(`${env.server.apiBaseUrl}/documents/download/${disputeId}/${documentId}/pdf`);
  }

}
