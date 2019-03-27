import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LonelyInHereComponent } from './lonely-in-here.component';

describe('LonelyInHereComponent', () => {
  let component: LonelyInHereComponent;
  let fixture: ComponentFixture<LonelyInHereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LonelyInHereComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LonelyInHereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
