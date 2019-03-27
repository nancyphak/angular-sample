import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment as env } from '@app/env';
import { DisputesService } from './disputes.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

describe('DisputesService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DisputesService]
    });
  });

  it('should be created', inject([DisputesService], (service: DisputesService) => {
    expect(service).toBeTruthy();
  }));

  describe('Create Disputes', () => {
    const dispute = {
      id: '4884d580-fe80-4e22-994b-cf4e1f4d48e4',
      name: 'item',
      timeCreated: '1000'
    };
  });

  describe('Get Disputes', () => {
    const mockDisputes = [
      {id: '4884d580-fe80-4e22-994b-cf4e1f4d48e4', name: 'some text'},
      {id: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36', name: 'another text'},
    ];

    it('should successfully get disputes',
      inject(
        [HttpTestingController, DisputesService],
        (httpMock: HttpTestingController, service: DisputesService) => {
          service.getDisputes().subscribe((res) => {
            expect(res).toEqual(mockDisputes);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/qry/FindDisputesByUser`);
          mockReq.flush(mockDisputes);
          expect(mockReq.request.method).toBe('GET');
          httpMock.verify();
        }
      )
    );

    it('should return error if get disputes failed',
      inject(
        [HttpTestingController, DisputesService],
        (httpMock: HttpTestingController, service: DisputesService) => {
          service.getDisputes().subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('GET_DISPUTES_ERROR');
            });
          const mockReq = httpMock.match(`${env.server.apiBaseUrl}/qry/FindDisputesByUser`);
          mockReq[0].error(new ErrorEvent('GET_DISPUTES_ERROR'));

          httpMock.verify();
        }
      )
    );
  });

  describe('Update Dispute', () => {
    const dispute = {
      disputeId: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36',
      newName: 'something text',
    };

    it('should update dispute successfully',
      inject(
        [HttpTestingController, DisputesService],
        (httpMock: HttpTestingController, service: DisputesService) => {
          service.updateDispute(dispute).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockRequest = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/RenameDispute`);
          expect(mockRequest.request.method).toBe('POST');
          httpMock.verify();
        }
      )
    );

    it('should return error if update dispute failed',
      inject(
        [HttpTestingController, DisputesService],
        (httpMock: HttpTestingController, service: DisputesService) => {
          service.updateDispute(dispute).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('UPDATE_DISPUTES_ERROR');
            });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/RenameDispute`);
          mockReq.error(new ErrorEvent('UPDATE_DISPUTES_ERROR'));

          httpMock.verify();
        }
      )
    );

  });

  describe('Delete dispute', () => {
    const dispute = {
      id: '4884d580-fe80-4e22-994b-cf4e1f4d48e4',
      name: 'item',
      timeCreated: '1000',
      boxFolderId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c'
    };

    it('should delete dispute successfully',
      inject(
        [HttpTestingController, DisputesService],
        (httpMock: HttpTestingController, service: DisputesService) => {
          service.removeDispute(dispute).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockRequest = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeleteDispute`);
          expect(mockRequest.request.method).toBe('POST');
          httpMock.verify();
        }
      )
    );

    it('should return error if delete dispute failed',
      inject(
        [HttpTestingController, DisputesService],
        (httpMock: HttpTestingController, service: DisputesService) => {
          service.removeDispute(dispute).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('DELETE_DISPUTES_ERROR');
            });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeleteDispute`);
          mockReq.error(new ErrorEvent('DELETE_DISPUTES_ERROR'));

          httpMock.verify();
        }
      )
    );

  });

});
