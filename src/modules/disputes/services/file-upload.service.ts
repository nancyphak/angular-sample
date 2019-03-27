import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { environment as env } from '@app/env';
import { FileUpload } from '../models';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) {
  }

  upload(fileUpload: FileUpload): Observable<any> {
    const url = `${env.server.apiBaseUrl}/documents/GetUploadDetails/${fileUpload.disputeId}/${fileUpload.id}/${fileUpload.fileName}`;
    return this.http.get(url).pipe(
      switchMap((res: any) => {
        const req = new HttpRequest('PUT', res.uri, fileUpload.file, {
          headers: new HttpHeaders(res.headers),
          reportProgress: true
        });
        return this.http.request(req);

      })
    );
  }
}
