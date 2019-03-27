import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';

import { cold, hot } from 'jasmine-marbles';
import { empty, Observable } from 'rxjs';

import { TestingModule } from 'testing/utils';
import { PleadingsEffects } from './pleadings.effect';
import { PleadingsService } from '../../services';
import * as fromPleadingActions from '../actions/pleadings.action';
import { Pleading } from '../../models';

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

describe('PleadingsEffects', () => {
  let actions$: TestActions;
  let effects: PleadingsEffects;
  let service: PleadingsService;

  const pleading = {
    disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
    id: '653ada50-acf5-4a52-a283-24b9c86325b1',
    title: 'something'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        PleadingsEffects,
        { provide: PleadingsService, useValue: {} },
        { provide: Actions, useFactory: getActions }
      ]
    });

    effects = TestBed.get(PleadingsEffects);
    actions$ = TestBed.get(Actions);
    service = TestBed.get(PleadingsService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('createPleading$', () => {
    it('should return a pleadingActions.CreatePleadingSuccess on success', () => {
      const action = new fromPleadingActions.CreateParagraph(pleading);
      const completion = new fromPleadingActions.CreateParagraphSuccess({} as any);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: {} as any });
      const expected = cold('--c', { c: completion });
      service.createParagraph = jasmine.createSpy('createParagraph').and.returnValue(response);

      expect(effects.createParagraph$).toBeObservable(expected);
      expect(service.createParagraph).toHaveBeenCalled();
    });

    it('should return a pleadingActions.CreatePleadingFail with error when error', () => {
      const action = new fromPleadingActions.CreateParagraph(pleading);
      const completion = new fromPleadingActions.CreateParagraphFail({
        failedAction: action
      });
      const error = 'Error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      service.createParagraph = jasmine.createSpy('createParagraph').and.returnValue(response);
      expect(effects.createParagraph$).toBeObservable(expected);
    });

  });

  describe('updateParagraph', () => {
    it('should return a pleadingActions.UpdateParagraph Success on success', () => {
      const action = new fromPleadingActions.UpdateParagraph(pleading);
      const completion = new fromPleadingActions.UpdateParagraphSuccess();

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: {} });
      const expected = cold('--c', { c: completion });
      service.updateParagraph = jasmine.createSpy('renamePerson').and.returnValue(response);

      expect(effects.updateParagraph$).toBeObservable(expected);
      expect(service.updateParagraph).toHaveBeenCalledWith(pleading);
    });

    it('should return a pleadingActions.UpdateParagraphFail with error when error', () => {
      const action = new fromPleadingActions.UpdateParagraph(pleading);
      const completion = new fromPleadingActions.UpdateParagraphFail({
        failedAction: action
      });
      const error = 'Error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      service.updateParagraph = jasmine.createSpy('updateParagraph').and.returnValue(response);
      expect(effects.updateParagraph$).toBeObservable(expected);
    });
  });

  describe('removeParagraph$', () => {

    const remove = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
    };

    it('should return a pleadingActions.RemoveParagraphSuccess on success', () => {
      const action = new fromPleadingActions.RemoveParagraph(remove);
      const completion = new fromPleadingActions.RemoveParagraphSuccess(remove);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: remove });
      const expected = cold('--c', { c: completion });
      service.removeParagraph = jasmine.createSpy('removeParagraph').and.returnValue(response);

      expect(effects.removeParagraph$).toBeObservable(expected);
      expect(service.removeParagraph).toHaveBeenCalledWith(remove);
    });

    it('should return a pleadingActions.RemoveParagraphFail with error when error', () => {
      const action = new fromPleadingActions.RemoveParagraph(remove);
      const completion = new fromPleadingActions.RemoveParagraphFail({
        failedAction: action
      });
      const error = 'Error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      service.removeParagraph = jasmine.createSpy('removeParagraph').and.returnValue(response);
      expect(effects.removeParagraph$).toBeObservable(expected);
    });
  });

  describe('loadPleadings$', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';

    it('should return a pleadingActions.LoadParagraphsSuccess, on success', () => {
      const pleadings: Array<Pleading> = [
        {
          id: '27f11786-a3f0-4328-9f6a-88c762db7a34',
          title: 'John Smith',
          sentences: [],
          responses: []
        }, {
          id: '27f11786-a3f0-4328-9f6a-88c762db7b32',
          title: 'John',
          sentences: [{ id: '5fdbbad-bf4c-a3f0-4328-9f6a-88c762', text: 'some any' }],
          responses: []
        }];
      const listPleadings = pleadings.map(item => {
        return {
          ...item,
          disputeId: disputeId
        };
      });
      const updateListPleadings = {
        disputeIdOfEntries: disputeId,
        paragraphs: listPleadings
      };
      const action = new fromPleadingActions.LoadParagraphs({ disputeId });
      const completion = new fromPleadingActions.LoadParagraphsSuccess(updateListPleadings);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: pleadings });
      const expected = cold('--c', { c: completion });
      service.getParagraphsByDispute = jasmine.createSpy('getParagraphsByDispute').and.returnValue(response);

      expect(effects.loadParagraphs$).toBeObservable(expected);
      expect(service.getParagraphsByDispute).toHaveBeenCalledWith(disputeId);
    });

    it('should return a pleadingActions.LoadParagraphsFail, if the service throws error', () => {
      const action = new fromPleadingActions.LoadParagraphs({ disputeId });
      const error = 'Error!';
      const completion = new fromPleadingActions.LoadParagraphsFail({
        failedAction: action
      });

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });

      service.getParagraphsByDispute = jasmine.createSpy('getPeopleByDispute').and.returnValue(response);

      expect(effects.loadParagraphs$).toBeObservable(expected);
    });
  });
  describe('createResponse', () => {
    const responseModel = {
      disputeId: '54-acf5-4a5250-a28acf5-4a-a28-acf5',
      paragraphId: '5250-a28-acf5-4a54-acf5-4ae45g',
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      title: 'response 1'
    };
    it('should return a pleadingActions.createResponseSuccess on success', () => {
      const action = new fromPleadingActions.CreateResponse(responseModel);
      const completion = new fromPleadingActions.CreateResponseSuccess({} as any);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: {} as any });
      const expected = cold('--c', { c: completion });
      service.createResponse = jasmine.createSpy('createResponse').and.returnValue(response);

      expect(effects.createResponse$).toBeObservable(expected);
      expect(service.createResponse).toHaveBeenCalled();
    });

    it('should return a pleadingActions.createResponseFail, if the service throws error', () => {
      const action = new fromPleadingActions.CreateResponse(responseModel);
      const error = 'Error!';
      const completion = new fromPleadingActions.CreateResponseFail({
        failedAction: action
      });

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });

      service.createResponse = jasmine.createSpy('createResponse').and.returnValue(response);

      expect(effects.createResponse$).toBeObservable(expected);
    });
  });

  describe('updateResponse', () => {
    const updateModel = {
      paragraphId: '653ada50-acf5-4a52-a283-24b9c86325b1',
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      id: '653ada50-acf5-4a52-a283-24b9c86456b1',
      title: 'test'
    };
    it('should return a pleadingActions.updateResponseSuccess on success', () => {
      const action = new fromPleadingActions.UpdateResponse(updateModel);
      const completion = new fromPleadingActions.UpdateResponseSuccess();

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: {} });
      const expected = cold('--c', { c: completion });
      service.updateResponse = jasmine.createSpy('updateResponse').and.returnValue(response);

      expect(effects.updateResponse$).toBeObservable(expected);
      expect(service.updateResponse).toHaveBeenCalledWith(updateModel);
    });

    it('should return a pleadingActions.createResponseFail, if the service throws error', () => {
      const action = new fromPleadingActions.UpdateResponse(updateModel);
      const error = 'Error!';
      const completion = new fromPleadingActions.UpdateResponseFail({
        failedAction: action
      });

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });

      service.updateResponse = jasmine.createSpy('updateResponse').and.returnValue(response);

      expect(effects.updateResponse$).toBeObservable(expected);
    });
  });
  describe('removeResponse$', () => {
    const removeModel = {
      paragraphId: '653ada50-acf5-4a52-a283-24b9c86325b1',
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      id: '653ada50-acf5-4a52-a283-24b9c86456b1',
      title: 'test'
    };

    it('should return a peopleActions.RemoveResponseSuccess on success', () => {
      const action = new fromPleadingActions.RemoveResponse(removeModel);
      const completion = new fromPleadingActions.RemoveResponseSuccess(removeModel);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: removeModel });
      const expected = cold('--c', { c: completion });
      service.removeResponse = jasmine.createSpy('removeResponse').and.returnValue(response);

      expect(effects.removeResponse$).toBeObservable(expected);
      expect(service.removeResponse).toHaveBeenCalledWith(removeModel);
    });

    it('should return a peopleActions.RemoveResponseFail with error when error', () => {
      const action = new fromPleadingActions.RemoveResponse(removeModel);
      const completion = new fromPleadingActions.RemoveResponseFail({
        failedAction: action
      });
      const error = 'Error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      service.removeResponse = jasmine.createSpy('removeResponse').and.returnValue(response);
      expect(effects.removeResponse$).toBeObservable(expected);
    });
  });

  describe('addParagraphSentences$', () => {
    const sentenceModel = {
      id: '653ada50-acf5-4a52-a283-24b9c86456b1',
      text: 'test'
    };
    it('should return a peopleActions.addParagraphSentencesSuccess on success', () => {
      const action = new fromPleadingActions.AddParagraphSentences(sentenceModel);
      const completion = new fromPleadingActions.AddParagraphSentencesSuccess({} as any);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: {} as any });
      const expected = cold('--c', { c: completion });
      service.addParagraphSentences = jasmine.createSpy('addParagraphSentences').and.returnValue(response);

      expect(effects.addParagraphSentences$).toBeObservable(expected);
      expect(service.addParagraphSentences).toHaveBeenCalled();
    });

    it('should return a peopleActions.CreatePleadingFail with error when error', () => {
      const action = new fromPleadingActions.AddParagraphSentences(sentenceModel);
      const completion = new fromPleadingActions.AddParagraphSentencesFail({
        failedAction: action
      });
      const error = 'Error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      service.addParagraphSentences = jasmine.createSpy('addParagraphSentences').and.returnValue(response);
      expect(effects.addParagraphSentences$).toBeObservable(expected);
    });
  });

  describe('addResponseSentences$', () => {
    const sentenceModel = {
      id: '653ada50-acf5-4a52-a283-24b9c86456b1',
      text: 'test'
    };
    it('should return a peopleActions.AddResponseSentencesSuccess on success', () => {
      const action = new fromPleadingActions.AddResponseSentences(sentenceModel);
      const completion = new fromPleadingActions.AddResponseSentencesSuccess({} as any);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: {} as any });
      const expected = cold('--c', { c: completion });
      service.addResponseSentences = jasmine.createSpy('addParagraphSentences').and.returnValue(response);

      expect(effects.addResponseSentences$).toBeObservable(expected);
      expect(service.addResponseSentences).toHaveBeenCalled();
    });

    it('should return a peopleActions.AddResponseSentencesFail with error when error', () => {
      const action = new fromPleadingActions.AddResponseSentences(sentenceModel);
      const completion = new fromPleadingActions.AddResponseSentencesFail({
        failedAction: action
      });
      const error = 'Error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      service.addResponseSentences = jasmine.createSpy('addResponseSentences').and.returnValue(response);
      expect(effects.addResponseSentences$).toBeObservable(expected);
    });
  });

  describe('removeSentence$', () => {
    const removeModel = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      sentence: { id: '0f75-e99-0f75-4804-be88-e014fadc6h5e', text: 'test' }
    };

    const model = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      id: '0f75-e99-0f75-4804-be88-e014fadc6h5e'
    };

    it('should return pleadingActions.RemoveSentenceSuccess on success', () => {
      const action = new fromPleadingActions.RemoveSentence(removeModel);
      const completion = new fromPleadingActions.RemoveSentenceSuccess(model);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: model });
      const expected = cold('--c', { c: completion });
      service.removeSentence = jasmine.createSpy('removeSentence').and.returnValue(response);

      expect(effects.removeSentence$).toBeObservable(expected);
      expect(service.removeSentence).toHaveBeenCalledWith(model);
    });

    it('should return a pleadingActions.RemoveResponseFail with error when error', () => {
      const action = new fromPleadingActions.RemoveSentence(removeModel);
      const completion = new fromPleadingActions.RemoveSentenceFail({
        failedAction: action
      });
      const error = 'Error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      service.removeSentence = jasmine.createSpy('removeSentence').and.returnValue(response);
      expect(effects.removeSentence$).toBeObservable(expected);
    });
  });
  describe('updateSentence', () => {
    const updateModel = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      sentence: {
        id: '653ada50-acf5-4a52-a283-24b9c86456b1',
        text: 'test'
      }
    };
    const model = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      id: '653ada50-acf5-4a52-a283-24b9c86456b1',
      newText: 'test'
    };
    it('should return a pleadingActions.updateSentenceSuccess on success', () => {
      const action = new fromPleadingActions.UpdateSentence(updateModel);
      const completion = new fromPleadingActions.UpdateSentenceSuccess(model);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: model });
      const expected = cold('--c', { c: completion });
      service.updateSentence = jasmine.createSpy('updateSentence').and.returnValue(response);

      expect(effects.updateSentences$).toBeObservable(expected);
      expect(service.updateSentence).toHaveBeenCalledWith(model);
    });

    it('should return a pleadingActions.updateSentenceFail, if the service throws error', () => {
      const action = new fromPleadingActions.UpdateSentence(updateModel);
      const error = 'Error!';
      const completion = new fromPleadingActions.UpdateSentenceFail({
        failedAction: action
      });

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });

      service.updateSentence = jasmine.createSpy('updateSentence').and.returnValue(response);

      expect(effects.updateSentences$).toBeObservable(expected);
    });
  });

  describe('assignSentenceToIssue', () => {
    const updateModel = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      paragraphId: '653ada50-acf5-4a52-a283-24b9c86456b1',
      response: [],
      sentence: { id: '473ada50-acf5-23ac43-24b94a52-a283', issueIds: ['23ac43-24b94a52-acf5-473ada50'] }
    };
    const model = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      sentenceId: '473ada50-acf5-23ac43-24b94a52-a283',
      issueIds: ['23ac43-24b94a52-acf5-473ada50'],
    };
    it('should return a pleadingActions.assignSentenceToIssueSuccess on success', () => {
      const action = new fromPleadingActions.AssignSentenceToIssue(updateModel);
      const completion = new fromPleadingActions.AssignSentenceToIssueSuccess(model);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: model });
      const expected = cold('--c', { c: completion });
      service.assignSentenceToIssue = jasmine.createSpy('assignSentenceToIssue').and.returnValue(response);

      expect(effects.assignSentenceToIssue$).toBeObservable(expected);
      expect(service.assignSentenceToIssue).toHaveBeenCalledWith(model);
    });

    it('should return a pleadingActions.assignSentenceToIssueFail, if the service throws error', () => {
      const action = new fromPleadingActions.AssignSentenceToIssue(updateModel);
      const error = 'Error!';
      const completion = new fromPleadingActions.AssignSentenceToIssueFail({
        failedAction: action
      });

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });

      service.assignSentenceToIssue = jasmine.createSpy('assignSentenceToIssue').and.returnValue(response);

      expect(effects.assignSentenceToIssue$).toBeObservable(expected);
    });
  });

});
