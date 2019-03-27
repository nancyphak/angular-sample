import { inject, TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment as env } from '@app/env';
import { PeopleService } from './people.service';
import { DeletePersonModel } from '../models';

describe('PeopleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PeopleService]
    });
  });

  it('should be created', inject([PeopleService], (service: PeopleService) => {
    expect(service).toBeTruthy();
  }));

  describe('getPeopleByDispute', () => {
    const disputeId = 'ad9dccbf-46df-4328-89bd-b8ac4057066c';
    const mockPeople = [{
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      name: 'Joe Bloggs',
      documentIds: []
    }];

    it('should successfully get people',
      inject(
        [HttpTestingController, PeopleService],
        (httpMock: HttpTestingController, service: PeopleService) => {
          service.getPeopleByDispute(disputeId).subscribe((res) => {
            expect(res).toEqual(mockPeople);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/qry/FindPeopleByDispute/${disputeId}`);
          mockReq.flush(mockPeople);
          expect(mockReq.request.method).toBe('GET');
          httpMock.verify();
        }
      )
    );

    it('should return error if get people failed',
      inject(
        [HttpTestingController, PeopleService],
        (httpMock: HttpTestingController, service: PeopleService) => {
          service.getPeopleByDispute(disputeId).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('GET_PEOPLE_ERROR');
            });
          const mockReq = httpMock.match(`${env.server.apiBaseUrl}/qry/FindPeopleByDispute/${disputeId}`);
          mockReq[0].error(new ErrorEvent('GET_PEOPLE_ERROR'));

          httpMock.verify();
        }
      )
    );

  });

  describe('Create Person', () => {
    const person = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      name: 'Joe Bloggs'
    };

    it('should create person successfully',
      inject(
        [HttpTestingController, PeopleService],
        (httpMock: HttpTestingController, service: PeopleService) => {
          service.createPerson(person).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockRequest = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/CreatePerson`);
          expect(mockRequest.request.method).toBe('POST');
          httpMock.verify();
        }
      )
    );

    it('should return error if create person failed',
      inject(
        [HttpTestingController, PeopleService],
        (httpMock: HttpTestingController, service: PeopleService) => {
          service.createPerson(person).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('set person error');
            });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/CreatePerson`);
          mockReq.error(new ErrorEvent('set person error'));

          httpMock.verify();
        }
      )
    );

  });

  describe('Delete Person', () => {
    const person: DeletePersonModel = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      personId: '653ada50-acf5-4a52-a283-24b9c86325b1'
    };

    it('should delete person successfully',
      inject(
        [HttpTestingController, PeopleService],
        (httpMock: HttpTestingController, service: PeopleService) => {
          service.removePerson(person).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockRequest = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeletePerson`);
          expect(mockRequest.request.method).toBe('POST');
          httpMock.verify();
        }
      )
    );

    it('should return error if delete person failed',
      inject(
        [HttpTestingController, PeopleService],
        (httpMock: HttpTestingController, service: PeopleService) => {
          service.removePerson(person).subscribe(() => {
            },
            (res: HttpErrorResponse) => {
              expect(res.error.type).toBe('DELETE_PERSON_ERROR');
            });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeletePerson`);
          mockReq.error(new ErrorEvent('DELETE_PERSON_ERROR'));

          httpMock.verify();
        }
      )
    );

  });

});
