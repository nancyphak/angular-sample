import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormEvidenceComponent } from './form-evidence.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('FromEvidenceComponent', () => {
  let component: FormEvidenceComponent;
  let fixture: ComponentFixture<FormEvidenceComponent>;
  let submitEl: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatInputModule
      ],
      declarations: [FormEvidenceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEvidenceComponent);
    component = fixture.componentInstance;

    submitEl = fixture.debugElement.query(By.css('#btn-submit'));

    component.issues = [];
    component.evidence = null;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
