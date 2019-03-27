import { inject, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment as env } from '@app/env';
import { PleadingsService } from './pleadings.service';

describe('PleadingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PleadingsService]
    });
  });

  it('should be created', inject([PleadingsService], (service: PleadingsService) => {
    expect(service).toBeTruthy();
  }));
  describe('getParagraphsByDispute', () => {
    const disputeId = 'ad9dccbf-46df-4328-89bd-b8ac4057066c';
    const mockPleading = [{
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      title: 'paragraph 1',
      responses: [],
      sentences: []

    }];

    it('should successfully get people',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.getParagraphsByDispute(disputeId).subscribe((res) => {
            expect(res).toEqual(mockPleading);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/qry/FindParagraphsByDispute/${disputeId}`);
          mockReq.flush(mockPleading);
          expect(mockReq.request.method).toBe('GET');
          httpMock.verify();
        })
    );
  });
  describe('createParagraph', () => {
    const paragraph = {
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      title: 'paragraph 1',
      responses: [],
      sentences: []

    };

    it('should successfully get people',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.createParagraph(paragraph).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/CreateParagraph`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      ));
  });
  describe('updateParagraph', () => {
    const paragraph = {
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      title: 'paragraph 1',
      responses: [],
      sentences: []

    };

    it('should successfully get people',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.updateParagraph(paragraph).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/RenameParagraph`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      ));
  });
  describe('removeParagraph', () => {
    const paragraph = {
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      title: 'paragraph 1',
      responses: [],
      sentences: []

    };

    it('should successfully get people',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.removeParagraph(paragraph).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeleteParagraph`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      ));
  });
  describe('createResponse', () => {
    const response = {
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      paragraphId: 'acf5-4a52-a283-24b9f-46df-4328',
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      title: 'response 1'

    };

    it('should successfully get people',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.createResponse(response).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/CreateResponse`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      ));
  });
  describe('removeResponse', () => {
    const response = {
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      paragraphId: 'acf5-4a52-a283-24b9f-46df-4328',
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      title: 'response 1',
      sentences: []

    };

    it('should successfully get people',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.removeResponse(response).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeleteResponse`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      ));
  });
  describe('updateResponse', () => {
    const response = {
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      paragraphId: 'acf5-4a52-a283-24b9f-46df-4328',
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      title: 'response 1',
      sentences: []

    };

    it('should successfully get people',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.updateResponse(response).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/RenameResponse`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      ));
  });
  describe('addParagraphSentences', () => {
    const paragraphSentence = {
      paragraphId: 'acf5-4a52-a283-24b9f-46df-4328',
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      title: 'some any',
      beforeSentenceId: '9dccbf-46df-43283-24b9f-46df-4328',
      sentences: []

    };

    it('should successfully get people',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.addParagraphSentences(paragraphSentence).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/AddParagraphSentences`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      ));
  });
  describe('addResponseSentences', () => {
    const paragraphSentence = {
      paragraphId: 'acf5-4a52-a283-24b9f-46df-4328',
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      responseId: '283-24b9f-4dccbf-46df-432cbf-46df-44',
      title: 'some any',
      beforeSentenceId: '9dccbf-46df-43283-24b9f-46df-4328',
      sentences: []

    };

    it('should successfully get people',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.addResponseSentences(paragraphSentence).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/AddResponseSentences`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      ));
  });
  describe('updateSentence', () => {
    const paragraphSentence = {
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      id: '283-24b9f-4dccbf-46df-432cbf-46df-44',
      newText: 'Sentence 1'

    };

    it('should successfully get people',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.updateSentence(paragraphSentence).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/UpdateSentenceText`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      ));
  });
  describe('removeSentence', () => {
    const paragraphSentence = {
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      id: '283-24b9f-4dccbf-46df-432cbf-46df-44'
    };

    it('should successfully get people',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.removeSentence(paragraphSentence).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/DeleteSentence`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      ));
  });
  describe('splitSentence', () => {
    const text = 'No boyfriend. No problem';
    it('should places each sentence on a new line with a blank like between each sentence',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.splitSentence(text).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/svc/SplitSentence`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      ));
  });
  describe('assignSentenceToIssue', () => {
    const sentences = {
      disputeId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
      sentenceId: '653ada50-acf5-4a52-a283-24b9c86325b1',
      issueIds: '283-24b9f-4dccbf-46df-432cbf-46df-44'
    };
    it('should assign sentence to issuee',
      inject(
        [HttpTestingController, PleadingsService],
        (httpMock: HttpTestingController, service: PleadingsService) => {
          service.assignSentenceToIssue(sentences).subscribe((res: HttpResponse<any>) => {
            expect(res.status).toBe(200);
          });
          const mockReq = httpMock.expectOne(`${env.server.apiBaseUrl}/cmd/AddIssueIdsToSentence`);
          expect(mockReq.request.method).toBe('POST');
          httpMock.verify();
        }
      ));
  });

});
