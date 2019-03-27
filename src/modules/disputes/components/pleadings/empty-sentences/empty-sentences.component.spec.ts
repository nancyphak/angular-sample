import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptySentencesComponent } from './empty-sentences.component';

describe('EmptySentencesComponent', () => {
  let component: EmptySentencesComponent;
  let fixture: ComponentFixture<EmptySentencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmptySentencesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptySentencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
