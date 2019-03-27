import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  forwardRef,
  Input,
  HostBinding
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[contenteditable]',
  providers:
    [
      { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ContentEditableDirective), multi: true }
    ]
})
export class ContentEditableDirective implements ControlValueAccessor {
  @HostBinding('attr.contenteditable') enabled = true;

  _maxlength: number;
  get maxlength(): number {
    return this._maxlength;
  }

  @Input('maxlength')
  set maxlength(value: number) {
    this._maxlength = value || 0;
  }

  private onChange: (value: string) => void;
  private onTouched: () => void;
  private removeDisabledState: () => void;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  @HostListener('input') onInput(): void {
    if (this.maxlength > 0 && this.elementRef.nativeElement.innerText.length >= this.maxlength) {
      this.elementRef.nativeElement.innerText = this.elementRef.nativeElement.innerText.slice(0, this.maxlength);
      this.placeCaretAtEnd();
    }
    this.onChange(this.elementRef.nativeElement.innerText);
  }

  @HostListener('blur') onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'innerText', value || '');
  }

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.enabled = !disabled;
  }

  placeCaretAtEnd() {
    this.elementRef.nativeElement.focus();
    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
      const range = document.createRange();
      range.selectNodeContents(this.elementRef.nativeElement);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}
