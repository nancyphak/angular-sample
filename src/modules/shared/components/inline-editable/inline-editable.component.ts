import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  HostListener, AfterViewInit, Renderer2, OnDestroy
} from '@angular/core';

type EditableType = 'text' | 'textarea' | 'number';

@Component({
  selector: 'inline-editable',
  templateUrl: './inline-editable.component.html',
  styleUrls: ['./inline-editable.component.scss']
})
export class InlineEditableComponent implements AfterViewInit, OnDestroy {
  @Input() value = '';
  @Input() placeholder = '';
  @Input() type: EditableType = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() maxlength = 0;
  @Input() underline = true;

  @Output() save: EventEmitter<string> = new EventEmitter();
  @Output() focused: EventEmitter<void> = new EventEmitter();
  @Output() blurred: EventEmitter<void> = new EventEmitter();
  @Output() input: EventEmitter<void> = new EventEmitter();

  @ViewChild('inputEditorControl') inputControl: ElementRef;

  editing = false;
  hovered = false;

  private _originalValue: any;
  private pasteEventListener: any;

  constructor(private renderer: Renderer2) { }

  @HostListener('mouseover', ['$event.target'])
  onMouseOver() {
    this.hovered = true;
  }

  @HostListener('mouseout', ['$event.target'])
  onMouseOut() {
    if (!this.editing) {
      this.hovered = false;
    }
  }

  ngAfterViewInit(): void {
    this.addPasteEventListener();
  }

  ngOnDestroy() {
    if (this.pasteEventListener) {
      this.pasteEventListener();
    }
  }

  addPasteEventListener() {
    if (this.type !== 'textarea') {
      return;
    }

    this.pasteEventListener = this.renderer.listen(this.inputControl.nativeElement, 'paste', (e) => {
      this.interceptPasteEvent(e);
    });
  }

  interceptPasteEvent(e: any): void {
    e.preventDefault();
    const content = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand('insertText', false, content);
  }

  saveValue() {
    if (this._originalValue !== this.value) {
      this.value = this.value.trim();
      this.save.emit(this.value);
    }
  }

  focus() {
    if (this.disabled) {
      return;
    }
    this._originalValue = this.value;
    this.editing = true;
    this.hovered = true;
    this.focusToInput();
  }

  focusToInput() {
    setTimeout(() => {
      if (this.editing) {
        this.inputControl.nativeElement.focus();
      }
    }, 0);
  }

  blur() {
    this.saveValue();
    this.editing = false;
    this.hovered = false;
    this.blurred.emit();
  }

  onBlur() {
    this.blur();
  }

  onFocus() {
    if (this.disabled) {
      return;
    }
    this._originalValue = this.value;
    this.editing = true;
    this.hovered = true;
    this.focused.emit();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.type === 'text') {
      this.blur();
    }
  }

  onInput() {
    this.input.emit();
  }
}
