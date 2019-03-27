import { Directive, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

const min = (value: number): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!value) {
      return null;
    }
    if (Validators.required(control)) {
      return null;
    }

    const v: number = +control.value;
    return v >= +value ? null : { actualValue: v, requiredValue: +value, min: true };
  };
};

@Directive({
  selector: '[min][formControlName],[min][formControl],[min][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MinValidatorDirective),
      multi: true
    }
  ]
})
export class MinValidatorDirective implements Validator, OnInit, OnChanges {
  @Input() min: number;

  private validator: ValidatorFn;
  private onChange: () => void;

  ngOnInit() {
    this.validator = min(this.min);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'min') {
        this.validator = min(changes[key].currentValue);
        if (this.onChange) {
          this.onChange();
        }
      }
    }
  }

  validate(c: AbstractControl): { [key: string]: any } {
    return this.validator(c);
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}

