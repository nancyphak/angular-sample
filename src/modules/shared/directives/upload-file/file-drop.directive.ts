import {
  Directive,
  HostListener,
  HostBinding,
  Output,
  EventEmitter,
  ElementRef,
  OnDestroy,
  Input
} from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Directive({
  selector: '[filesDrop]'
})
export class FileDropDirective implements OnDestroy {
  @HostBinding('class.drag-over-zone') private dragOverFlag = false;
  @Input() filesDropDisable: boolean;
  @Output() fileDrop: EventEmitter<any> = new EventEmitter<any>();
  @Output() fileOver: EventEmitter<any> = new EventEmitter<any>();

  files: Array<any> = [];
  stack = [];
  private timerSubscription: Subscription;
  isOverOnDropZone = false;

  constructor(private element: ElementRef) {
  }

  @HostListener('document:dragover', ['$event'])
  public onDragOver(event: any): void {
    if (this.filesDropDisable) {
      return;
    }

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
    this.timerSubscription = timer(300).subscribe(() => {
      this.fileOver.emit(false);
      this.timerSubscription.unsubscribe();
    });

    const isOverOnDropZone = this.element.nativeElement.contains(event.target);
    if (isOverOnDropZone) {
      event.dataTransfer.dropEffect = 'copy';
      this.isOverOnDropZone = true;
    } else {
      this.isOverOnDropZone = false;
      event.dataTransfer.dropEffect = 'none';
    }
    const transferItems = Array.from(event.dataTransfer.items);
    if (transferItems.length > 0) {
      const hasPdfFile = transferItems.some((x: DataTransferItem) => x.type === 'application/pdf');
      if (hasPdfFile) {
        this.fileOver.emit(true);
      } else {
        this.fileOver.emit(false);
      }
    }
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any): void {
    if (this.filesDropDisable) {
      return;
    }
    if (!this.isOverOnDropZone) {
      this.fileOver.emit(false);
    }
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:drop', ['$event'])
  public onDrop(event) {
    if (this.filesDropDisable) {
      return;
    }
    if (this.isOverOnDropZone) {
      this.fileDrop.emit(event.dataTransfer.files);
    }
    event.preventDefault();
    event.stopPropagation();
  }

  ngOnDestroy() {

  }

}
