import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUpload } from '../../../models';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent {
  @Input() fileUpload: FileUpload;
  @Output() cancel: EventEmitter<FileUpload>;

  constructor() {
    this.cancel = new EventEmitter<FileUpload>();
  }

  onCancelClicked() {
    this.cancel.emit({...this.fileUpload});
  }
}
