import { Directive, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export const max = (value: number): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!value) {
      return null;
    }
    if (Validators.required(control)) {
      return null;
    }

    const v: number = +control.value;
    return v <= +value ? null : { actualValue: v, requiredValue: +value, max: true };
  };
};

@Directive({
  selector: '[max][formControlName],[max][formControl],[max][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MaxValidatorDirective),
      multi: true
    }
  ]
})
export class MaxValidatorDirective implements Validator, OnInit, OnChanges {
  @Input() max: number;

  private validator: ValidatorFn;
  private onChange: () => void;

  ngOnInit() {
    this.validator = max(this.max);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'max') {
        this.validator = max(changes[key].currentValue);
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

