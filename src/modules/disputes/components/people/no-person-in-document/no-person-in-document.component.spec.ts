import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPersonInDocumentComponent } from './no-person-in-document.component';

describe('NoPersonInDocumentComponent', () => {
  let component: NoPersonInDocumentComponent;
  let fixture: ComponentFixture<NoPersonInDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoPersonInDocumentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPersonInDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
