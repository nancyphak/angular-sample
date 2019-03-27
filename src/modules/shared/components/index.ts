import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { PromptDialogComponent } from './prompt-dialog/prompt-dialog.component';
import { LonelyInHereComponent } from './lonely-in-here/lonely-in-here.component';
import { PdfJsViewerComponent } from './pdfjs-viewer/pdfjs-viewer.component';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { AutoTrackViewComponent } from './auto-track-view/auto-track-view.component';
import { InlineEditableComponent } from './inline-editable/inline-editable.component';
import { PreviewToggleComponent } from './preview-toggle/preview-toggle.component';
import { ChipListComponent } from './chips/chip-list.component';
import { ChipComponent } from './chips/chip.component';
import { SplitViewComponent } from './split-view/split-view.component';
import { NotifyDialogComponent } from './notify-dialog/notify-dialog.component';

export {
  SnackBarComponent,
  LoadingBarComponent,
  AlertDialogComponent as AlertDialog,
  PromptDialogComponent as PromptDialog,
  NotifyDialogComponent as NotifyDialog,
  ConfirmDialogComponent as ConfirmDialog,
  LonelyInHereComponent,
  LoadingDialogComponent as LoadingDialog,
  AutoTrackViewComponent,
  InlineEditableComponent,
  ChipComponent,
  SplitViewComponent
};

export const components: Array<any> = [
  ConfirmDialogComponent,
  AlertDialogComponent,
  SnackBarComponent,
  LoadingBarComponent,
  PromptDialogComponent,
  LonelyInHereComponent,
  PdfJsViewerComponent,
  LoadingDialogComponent,
  InlineEditableComponent,
  PreviewToggleComponent,
  ChipListComponent,
  ChipComponent,
  NotifyDialogComponent,
  SplitViewComponent
];

export const entryComponents: Array<any> = [
  ConfirmDialogComponent,
  SnackBarComponent,
  AlertDialogComponent,
  PromptDialogComponent,
  LoadingDialogComponent,
  NotifyDialogComponent
];
