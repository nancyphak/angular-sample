import { inject, TestBed } from '@angular/core/testing';

import { UnSavedGuard } from './un-saved.guard';

describe('UnSavedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnSavedGuard]
    });
  });

  it('should ...', inject([UnSavedGuard], (guard: UnSavedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
