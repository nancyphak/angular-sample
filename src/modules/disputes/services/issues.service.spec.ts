import { inject, TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment as env } from '@app/env';
import { IssuesService } from './issues.service';

describe('IssuesService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IssuesService]
    });
  });

  it('should be created', inject([IssuesService], (service: IssuesService) => {
    expect(service).toBeTruthy();
  }));

  describe('Create Issues', () => {
    const issue = {
      id: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36',
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      name: 'some text',
      notes: 'some notes'
    };

    it('should create issue successfully ',
      inject(
        [HttpTestingController, IssuesService],
        (httpMock: HttpTestingController, service: IssuesService) => {
          service.createIssue(issue).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/CreateIssue`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      )
    );

    it('should return error if create dispute failed',
      inject(
        [HttpTestingController, IssuesService],
        (httpMock: HttpTestingController, service: IssuesService) => {
          service.createIssue(issue).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('CREATE_ISSUES_ERROR');
            });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/CreateIssue`);
          mockReq.error(new ErrorEvent('CREATE_ISSUES_ERROR'));

          httpMock.verify();
        }
      )
    );

  });

  describe('Get Issues', () => {
    const disputeId = 'ad9dccbf-46df-4328-89bd-b8ac4057066c';
    const mockIssues = [{
      id: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36',
      name: 'some text',
      notes: 'some notes'
    }];

    it('should successfully get issues',
      inject(
        [HttpTestingController, IssuesService],
        (httpMock: HttpTestingController, service: IssuesService) => {
          service.getIssues(disputeId).subscribe((res) => {
            expect(res).toEqual(mockIssues);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/qry/FindIssuesByDispute/${disputeId}`);
          mockReq.flush(mockIssues);
          expect(mockReq.request.method).toBe('GET');
          httpMock.verify();
        }
      )
    );

    it('should return error if get issues failed',
      inject(
        [HttpTestingController, IssuesService],
        (httpMock: HttpTestingController, service: IssuesService) => {
          service.getIssues(disputeId).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('GET_ISSUES_ERROR');
            });
          const mockReq = httpMock.match(`${env.server.apiBaseUrl}/qry/FindIssuesByDispute/${disputeId}`);
          mockReq[0].error(new ErrorEvent('GET_ISSUES_ERROR'));

          httpMock.verify();
        }
      )
    );
  });

  describe('Update Issue', () => {
    const issue = {
      id: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      disputeId: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36',
      newName: 'something text',
    };

    it('should update issue successfully ',
      inject(
        [HttpTestingController, IssuesService],
        (httpMock: HttpTestingController, service: IssuesService) => {
          service.updateIssue(issue).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockRequest = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/RenameIssue`);
          expect(mockRequest.request.method).toBe('POST');
          httpMock.verify();
        }
      )
    );

    it('should return error if update issue failed',
      inject(
        [HttpTestingController, IssuesService],
        (httpMock: HttpTestingController, service: IssuesService) => {
          service.updateIssue(issue).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('UPDATE_ISSUES_ERROR');
            });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/RenameIssue`);
          mockReq.error(new ErrorEvent('UPDATE_ISSUES_ERROR'));

          httpMock.verify();
        }
      )
    );

  });

  describe('Delete issue', () => {
    const issue = {
      id: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36',
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      name: 'some text',
      notes: 'some notes'
    };

    it('should delete issue successfully ',
      inject(
        [HttpTestingController, IssuesService],
        (httpMock: HttpTestingController, service: IssuesService) => {
          service.removeIssue(issue).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockRequest = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeleteIssue`);
          expect(mockRequest.request.method).toBe('POST');
          httpMock.verify();
        }
      )
    );

    it('should return error if delete issue failed',
      inject(
        [HttpTestingController, IssuesService],
        (httpMock: HttpTestingController, service: IssuesService) => {
          service.removeIssue(issue).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('DELETE_ISSUES_ERROR');
            });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeleteIssue`);
          mockReq.error(new ErrorEvent('DELETE_ISSUES_ERROR'));

          httpMock.verify();
        }
      )
    );

  });

  describe('Set Issue Notes', () => {
    const issue = {
      id: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36',
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      name: 'some text',
      notes: 'some notes'
    };

    it('should set notes for issue successfully ',
      inject(
        [HttpTestingController, IssuesService],
        (httpMock: HttpTestingController, service: IssuesService) => {
          service.setIssueNotes(issue).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockRequest = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/SetIssueNotes`);
          expect(mockRequest.request.method).toBe('POST');
          httpMock.verify();
        }
      )
    );

    it('should return error if cannot set notes for issue',
      inject(
        [HttpTestingController, IssuesService],
        (httpMock: HttpTestingController, service: IssuesService) => {
          service.setIssueNotes(issue).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('SET_ISSUES_NOTES_ERROR');
            });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/SetIssueNotes`);
          mockReq.error(new ErrorEvent('SET_ISSUES_NOTES_ERROR'));

          httpMock.verify();
        }
      )
    );

  });

  describe('Delete issue', () => {
    const issue = {
      id: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36',
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      name: 'some text',
      notes: 'some notes'
    };

    it('should delete issue successfully ',
      inject(
        [HttpTestingController, IssuesService],
        (httpMock: HttpTestingController, service: IssuesService) => {
          service.removeIssueNotes(issue).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockRequest = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeleteIssueNotes`);
          expect(mockRequest.request.method).toBe('POST');
          httpMock.verify();
        }
      )
    );

    it('should return error if delete isues failed',
      inject(
        [HttpTestingController, IssuesService],
        (httpMock: HttpTestingController, service: IssuesService) => {
          service.removeIssueNotes(issue).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('DELETE_ISSUES_NOTES_ERROR');
            });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeleteIssueNotes`);
          mockReq.error(new ErrorEvent('DELETE_ISSUES_NOTES_ERROR'));

          httpMock.verify();
        }
      )
    );

  });

});
