import { Actions } from '@ngrx/effects';
import { TestBed } from '@angular/core/testing';

import { empty, Observable } from 'rxjs';

import { SharesService } from '../../services';
import { SharesEffects } from './shares.effect';
import { cold, hot } from 'jasmine-marbles';
import * as fromSharesActions from '../actions/shares.action';

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

describe('SharesEffects', () => {
  let actions$: TestActions;
  let effects: SharesEffects;
  let service: SharesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SharesEffects,
        {provide: SharesService, useValue: {}},
        {provide: Actions, useFactory: getActions}
      ]
    });

    effects = TestBed.get(SharesEffects);
    actions$ = TestBed.get(Actions);
    service = TestBed.get(SharesService);
  });
  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadSharesDisputes$', () => {
    const disputeId = '5fddbbad-bf4c-420c-9e6c-f9c5b979de36';

    it('should return a sharesActions.LoadSharesSuccess, on success', () => {
      const shares: Array<any> = [
        {
          id: '71b4606b-a98c-4074-89d7-939bada4dd46',
          email: 'foo@bar.com',
          status: 'PENDING'
        }, {
          id: '27f11786-a3f0-4328-9f6a-88c762db7b32',
          email: 'foo1@bar.com',
          status: 'PENDING'
        }];
      const listShares = shares.map(item => {
        return {
          id: item.id,
          disputeId: disputeId,
          email: item.user,
          status: item.status
        };
      });
      const action = new fromSharesActions.LoadShares(disputeId);
      const completion = new fromSharesActions.LoadSharesSuccess(listShares);

      actions$.stream = hot('-a', {a: action});
      const response = cold('-b', {b: shares});
      const expected = cold('--c', {c: completion});
      service.getSharesByDispute = jasmine.createSpy('getSharesByDispute').and.returnValue(response);

      expect(effects.loadSharesDisputes$).toBeObservable(expected);
      expect(service.getSharesByDispute).toHaveBeenCalledWith(disputeId);
    });

    it('should return a sharesActions.LoadSharesFail, if the service throws error', () => {
      const action = new fromSharesActions.LoadShares(disputeId);
      const error = 'Error!';
      const completion = new fromSharesActions.LoadSharesFail({
        failedAction: action
      });

      actions$.stream = hot('-a', {a: action});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: completion});

      service.getSharesByDispute = jasmine.createSpy('getSharesByDispute').and.returnValue(response);

      expect(effects.loadSharesDisputes$).toBeObservable(expected);
    });

  });

  describe('createShareDispute$', () => {
    const createShareModel = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      email: 'test@gmail.com',
      status: 'PENDING'
    };

    it('should return a sharesActions.CreateShareSuccess on success', () => {
      const action = new fromSharesActions.CreateShare(createShareModel);
      const completion = new fromSharesActions.CreateShareSuccess({} as any);

      actions$.stream = hot('-a', {a: action});
      const response = cold('-b', {b: {} as any});
      const expected = cold('--c', {c: completion});
      service.createShare = jasmine.createSpy('createShare').and.returnValue(response);

      expect(effects.createShareDispute$).toBeObservable(expected);
      expect(service.createShare).toHaveBeenCalled();
    });

    it('should return a sharesActions.CreateShareFail, if the service throws error', () => {
      const action = new fromSharesActions.CreateShare(createShareModel);
      const error = 'Error!';
      const completion = new fromSharesActions.CreateShareFail({
        failedAction: action
      });

      actions$.stream = hot('-a', {a: action});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: completion});

      service.createShare = jasmine.createSpy('createShare').and.returnValue(response);

      expect(effects.createShareDispute$).toBeObservable(expected);
    });

  });

  describe('removeShareDispute$', () => {
    const removeModel = {
      disputeId: '691e2e99-0f75-4804-be88-e014fadc3a93',
      id: '653ada50-acf5-4a52-a283-24b9c86325b1',
      email: 'test@gmail.com',
      status: 'PENDING'
    };

    it('should return a sharesActions.RemoveShare on success', () => {
      const action = new fromSharesActions.RemoveShare(removeModel);
      const completion = new fromSharesActions.RemoveShareSuccess(removeModel);

      actions$.stream = hot('-a', {a: action});
      const response = cold('-b', {b: removeModel});
      const expected = cold('--c', {c: completion});
      service.removeShare = jasmine.createSpy('removeResponse').and.returnValue(response);

      expect(effects.removeShareDispute$).toBeObservable(expected);
      expect(service.removeShare).toHaveBeenCalledWith(removeModel);
    });

    it('should return a sharesActions.RemoveShareFail with error when error', () => {
      const action = new fromSharesActions.RemoveShare(removeModel);
      const completion = new fromSharesActions.RemoveShareFail({
        failedAction: action
      });
      const error = 'Error!';

      actions$.stream = hot('-a', {a: action});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: completion});
      service.removeShare = jasmine.createSpy('removeResponse').and.returnValue(response);
      expect(effects.removeShareDispute$).toBeObservable(expected);
    });
  });

});
