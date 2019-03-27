import { inject, TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment as env } from '@app/env';
import { EvidencesService } from './evidences.service';

describe('EvidencesService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EvidencesService]
    });
  });

  it('should be created', inject([EvidencesService], (service: EvidencesService) => {
    expect(service).toBeTruthy();
  }));

  describe('Create Evidence', () => {
    const evidence = {
      EvidenceId: '4884d580-fe80-4e22-994b-cf4e1f4d48e4',
      Text: 'some text',
      PageNumber: 1,
      DocumentId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      IssueIds: [],
      DisputeId: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36'
    };

    it('should create evidence successfully ',
      inject(
        [HttpTestingController, EvidencesService],
        (httpMock: HttpTestingController, service: EvidencesService) => {
          service.createEvidence(evidence).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/CreateEvidence`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      )
    );

    it('should return error if create evidences failed',
      inject(
        [HttpTestingController, EvidencesService],
        (httpMock: HttpTestingController, service: EvidencesService) => {
          service.createEvidence(evidence).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('CREATE_EVIDENCES_ERROR');
            });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/CreateEvidence`);
          mockReq.error(new ErrorEvent('CREATE_EVIDENCES_ERROR'));

          httpMock.verify();
        }
      )
    );

  });

  describe('Get Evidences By Dispute', () => {
    const disputeId = 'ad9dccbf-46df-4328-89bd-b8ac4057066c';
    const mockEvidences = [
      {id: '4884d580-fe80-4e22-994b-cf4e1f4d48e4', text: 'some text', pageNumber: 1},
      {id: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36', text: 'another text', pageNumber: 2},
    ];

    it('should successfully get list evidence',
      inject(
        [HttpTestingController, EvidencesService],
        (httpMock: HttpTestingController, service: EvidencesService) => {
          service.getEvidencesByDispute(disputeId).subscribe((res) => {
            expect(res).toEqual(mockEvidences);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/qry/FindEvidenceByDispute/${disputeId}`);
          mockReq.flush(mockEvidences);
          expect(mockReq.request.method).toBe('GET');
          httpMock.verify();
        }
      )
    );

    it('should return error if get evidences failed',
      inject(
        [HttpTestingController, EvidencesService],
        (httpMock: HttpTestingController, service: EvidencesService) => {
          service.getEvidencesByDispute(disputeId).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('GET_EVIDENCES_ERROR');
            });
          const mockReq = httpMock.match(`${env.server.apiBaseUrl}/qry/FindEvidenceByDispute/${disputeId}`);
          mockReq[0].error(new ErrorEvent('GET_EVIDENCES_ERROR'));

          httpMock.verify();
        }
      )
    );
  });

  describe('Update Evidence', () => {
    const evidence = {
      id: '4884d580-fe80-4e22-994b-cf4e1f4d48e4',
      text: 'updated text',
      pageNumber: 2,
      documentId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      issueIds: ['4884d580-fe80-4e22-994b-cf4e1f4d48e5'],
      disputeId: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36'
    };

    it('should update evidence successfully ',
      inject(
        [HttpTestingController, EvidencesService],
        (httpMock: HttpTestingController, service: EvidencesService) => {
          service.updateEvidence(evidence).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockRequest = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/UpdateEvidence`);
          expect(mockRequest.request.method).toBe('POST');
          httpMock.verify();
        }
      )
    );

    it('should return error if update evidence failed',
      inject(
        [HttpTestingController, EvidencesService],
        (httpMock: HttpTestingController, service: EvidencesService) => {
          service.updateEvidence(evidence).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('UPDATE_EVIDENCES_ERROR');
            });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/UpdateEvidence`);
          mockReq.error(new ErrorEvent('UPDATE_EVIDENCES_ERROR'));

          httpMock.verify();
        }
      )
    );

  });

  describe('Delete evidence', () => {
    const evidence = {
      id: '4884d580-fe80-4e22-994b-cf4e1f4d48e4',
      text: 'updated text',
      pageNumber: 2,
      documentId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      issueIds: ['4884d580-fe80-4e22-994b-cf4e1f4d48e5'],
      disputeId: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36'
    };

    it('should delete evidence successfully ',
      inject(
        [HttpTestingController, EvidencesService],
        (httpMock: HttpTestingController, service: EvidencesService) => {
          service.removeEvidence(evidence).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockRequest = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeleteEvidence`);
          expect(mockRequest.request.method).toBe('POST');
          httpMock.verify();
        }
      )
    );

    it('should return error if delete evidence failed',
      inject(
        [HttpTestingController, EvidencesService],
        (httpMock: HttpTestingController, service: EvidencesService) => {
          service.removeEvidence(evidence).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('DELETE_EVIDENCES_ERROR');
            });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeleteEvidence`);
          mockReq.error(new ErrorEvent('DELETE_EVIDENCES_ERROR'));

          httpMock.verify();
        }
      )
    );

  });

});
