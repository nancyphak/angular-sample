import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[browseFile]'
})
export class BrowseFileDirective {
  @Output() fileSelected: EventEmitter<Array<File>> = new EventEmitter<Array<File>>();

  @HostListener('change', ['$event'])
  public onChange(event: any): void {
    if (!event || !event.target) {
      return;
    }
    const files = event.target.files;
    if (files && files.length) {
      const fileArray: Array<File> = [];
      for (let i = 0; i < files.length; i++) {
        fileArray.push(files.item(i));
      }
      if (fileArray.length > 0) {
        event.target.value = '';
        this.fileSelected.emit(fileArray);
      }
    }
  }
}
