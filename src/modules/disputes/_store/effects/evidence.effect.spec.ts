import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';

import { cold, hot } from 'jasmine-marbles';
import { empty, Observable } from 'rxjs';

import { TestingModule } from 'testing/utils';
import { EvidenceEffects } from './evidence.effect';
import { EvidencesService } from '../../services';
import * as fromEvidenceActions from '../actions/evidences.action';

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('EvidenceEffects', () => {
  let actions$: TestActions;
  let effects: EvidenceEffects;
  let service: EvidencesService;
  const createEvidenceModel = {
    EvidenceId: '4884d580-fe80-4e22-994b-cf4e1f4d48e4',
    Text: 'Some text',
    PageNumber: 5,
    DocumentId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
    IssueIds: [],
    DisputeId: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36'
  };
  const evidence = {
    id: '4884d580-fe80-4e22-994b-cf4e1f4d48e4',
    text: 'Some text',
    pageNumber: 5,
    documentId: 'ad9dccbf-46df-4328-89bd-b8ac4057066c',
    issueIds: [],
    disputeId: '5fddbbad-bf4c-420c-9e6c-f9c5b979de36'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        EvidenceEffects,
        {provide: EvidencesService, useValue: {}},
        {provide: Actions, useFactory: getActions}
      ]
    });

    effects = TestBed.get(EvidenceEffects);
    actions$ = TestBed.get(Actions);
    service = TestBed.get(EvidencesService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('createEvidence$', () => {
    it('should return a evidencesActions.CreateEvidenceSuccess, on success', () => {
      const action = new fromEvidenceActions.CreateEvidence(createEvidenceModel);
      const completion = new fromEvidenceActions.CreateEvidenceSuccess({} as any);

      actions$.stream = hot('-a', {a: action});
      const response = cold('-b', {b: {} as any});
      const expected = cold('--c', {c: completion});
      service.createEvidence = jasmine.createSpy('createEvidence').and.returnValue(response);

      expect(effects.createEvidence$).toBeObservable(expected);
      expect(service.createEvidence).toHaveBeenCalled();
    });

    it('should return a evidencesActions.CreateEvidenceFail with error when the createEvidence error', () => {
      const action = new fromEvidenceActions.CreateEvidence(createEvidenceModel);
      const completion = new fromEvidenceActions.CreateEvidenceFail({
        failedAction: action
      });
      const error = 'Error!';

      actions$.stream = hot('-a', {a: action});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: completion});

      service.createEvidence = jasmine.createSpy('createEvidence').and.returnValue(response);
      expect(effects.createEvidence$).toBeObservable(expected);
    });

  });

  describe('updateEvidence$', () => {

    it('should return a evidencesActions.UpdateEvidenceSuccess, on success', () => {
      const action = new fromEvidenceActions.UpdateEvidence(evidence);
      const completion = new fromEvidenceActions.UpdateEvidenceSuccess(true);

      actions$.stream = hot('-a', {a: action});
      const response = cold('-b', {b: true});
      const expected = cold('--c', {c: completion});
      service.updateEvidence = jasmine.createSpy('updateEvidence').and.returnValue(response);

      expect(effects.updateEvidence$).toBeObservable(expected);
      expect(service.updateEvidence).toHaveBeenCalledWith(evidence);
    });

    it('should return a evidencesActions.UpdateEvidenceFail with error when the updateEvidence error', () => {
      const action = new fromEvidenceActions.UpdateEvidence(evidence);
      const completion = new fromEvidenceActions.UpdateEvidenceFail({
        failedAction: action
      });
      const error = 'Error!';
      actions$.stream = hot('-a', {a: action});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: completion});

      service.updateEvidence = jasmine.createSpy('updateEvidence').and.returnValue(response);
      expect(effects.updateEvidence$).toBeObservable(expected);
    });

  });

  describe('removeEvidence$', () => {

    it('should return a evidencesActions.DeleteEvidenceSuccess, on success', () => {
      const action = new fromEvidenceActions.DeleteEvidence(evidence);
      const completion = new fromEvidenceActions.DeleteEvidenceSuccess(true);

      actions$.stream = hot('-a', {a: action});
      const response = cold('-b', {b: true});
      const expected = cold('--c', {c: completion});
      service.removeEvidence = jasmine.createSpy('removeEvidence').and.returnValue(response);

      expect(effects.removeEvidence$).toBeObservable(expected);
      expect(service.removeEvidence).toHaveBeenCalledWith(evidence);
    });

    it('should return a evidencesActions.DeleteEvidenceFail with error when the deleteEvidence error', () => {
      const action = new fromEvidenceActions.DeleteEvidence(evidence);
      const completion = new fromEvidenceActions.DeleteEvidenceFail({
        failedAction: action
      });
      const error = 'Error!';
      actions$.stream = hot('-a', {a: action});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: completion});

      service.removeEvidence = jasmine.createSpy('removeEvidence').and.returnValue(response);
      expect(effects.removeEvidence$).toBeObservable(expected);
    });

  });

  describe('getEvidencesByDispute$', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';

    it('should return a evidencesActions.GetEvidencesByDisputeSuccess, on success', () => {
      const evidences = [
        {
          documentId: '274327657787',
          id: '27f11786-a3f0-4328-9f6a-88c762db7a34',
          issueIds: ['9460a29f-fb2a-4a3f-896d-911e384342a9'],
          pageNumber: 15,
          text: 'Lorem ipsum'
        }, {
          documentId: '274327657787',
          id: '27f11786-a3f0-4328-9f6a-88c762db7b32',
          issueIds: ['9460a29f-fb2a-4a3f-896d-911e384342a9'],
          pageNumber: 15,
          text: 'Lorem ipsum'
        }];
      const listEvidences = evidences.map(item => {
        return {
          ...item,
          disputeId: disputeId,
          issues: []
        };
      });
      const updateListEvidences = {
        evidences: listEvidences,
        disputeIdOfEvidenceEntries: disputeId
      };
      const action = new fromEvidenceActions.GetEvidencesByDispute({disputeId: disputeId});
      const completion = new fromEvidenceActions.GetEvidencesByDisputeSuccess(updateListEvidences);

      actions$.stream = hot('-a', {a: action});
      const response = cold('-b', {b: evidences});
      const expected = cold('--c', {c: completion});
      service.getEvidencesByDispute = jasmine.createSpy('getEvidencesByDispute').and.returnValue(response);

      expect(effects.getEvidencesByDispute$).toBeObservable(expected);
      expect(service.getEvidencesByDispute).toHaveBeenCalledWith(disputeId);
    });

    it('should return a evidencesActions.GetEvidencesByDisputeFail, if the service throws', () => {
      const action = new fromEvidenceActions.GetEvidencesByDispute({disputeId: disputeId});
      const error = 'Error!';
      const completion = new fromEvidenceActions.GetEvidencesByDisputeFail({
        failedAction: action
      });

      actions$.stream = hot('-a', {a: action});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: completion});

      service.getEvidencesByDispute = jasmine.createSpy('getEvidencesByDispute').and.returnValue(response);

      expect(effects.getEvidencesByDispute$).toBeObservable(expected);
    });

  });

});
