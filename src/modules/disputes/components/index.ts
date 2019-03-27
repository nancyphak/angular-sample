import { DisputeItemComponent } from './disputes/dispute-item/dispute-item.component';
import { DisputeListComponent } from './disputes/dispute-list/dispute-list.component';

import { IssueItemComponent } from './issues/issue-item/issue-item.component';
import { FormIssueNotesComponent } from './issues/form-issue-notes/form-issue-notes.component';

import { FormEvidenceComponent } from './evidences/form-evidence/form-evidence.component';
import { SelectIssueDialogComponent } from './evidences/select-issue-dialog/select-issue-dialog.component';
import { EvidenceComponent } from './evidences/evidence/evidence.component';
import { NoEvidenceComponent } from './evidences/no-evidence/no-evidence.component';
import { EvidenceInlineFormComponent } from './evidences/evidence-inline-form/evidence-inline-form.component';

import { NoPersonInDocumentComponent } from './people/no-person-in-document/no-person-in-document.component';
import { SelectPersonDialogComponent } from './people/select-person-dialog/select-person-dialog.component';
import { PersonDetailComponent } from './people/person-detail/person-detail.component';

import { FormDocumentMetadataComponent } from './documents/form-document-metadata/form-document-metadata.component';
import { DocumentTableComponent } from './documents/document-table/document-table.component';

import { EmptySentencesComponent } from './pleadings/empty-sentences/empty-sentences.component';
import { PleadingItemComponent } from './pleadings/pleading-item/pleading-item.component';
import { AddSentencesDialogComponent } from './pleadings/add-sentences-dialog/add-sentences-dialog.component';
import { SentenceComponent } from './pleadings/sentence/sentence.component';
import { EditSentenceDialogComponent } from './pleadings/edit-sentence-dialog/edit-sentence-dialog.component';
import {
  UnassignIssueFromSentenceDialogComponent
} from './pleadings/unassign-issue-from-sentence-dialog/unassign-issue-from-sentence-dialog.component';
import { ListChronologiesComponent } from './chronologies/list-chronologies/list-chronologies.component';
import { FileUploadComponent } from './documents/file-upload/file-upload.component';
import { ListEventComponent } from './documents/list-event/list-event.component';
import { FormCreateComponent } from './documents/form-create/form-create.component';
import { PleadingListComponent } from './pleadings/pleading-list/pleading-list.component';
import { IssueTreeComponent } from './issue-tree/issue-tree/issue-tree.component';
import { IssueTreeNodeComponent } from './issue-tree/issue-tree-node/issue-tree-node.component';
import { TopNavBarComponent } from './top-nav-bar/top-nav-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { IssuePreviewItemComponent } from './issues/issue-preview-item/issue-preview-item.component';
import { IssuePleadingsComponent } from './issues/issue-pleadings/issue-pleadings.component';
import { EditPleadingDialogComponent } from './pleadings/edit-pleading-dialog/edit-pleading-dialog.component';
import { ParagraphViewComponent } from './pleadings/paragraph-view/paragraph-view.component';
import { EvidenceViewComponent } from './evidences/evidence-view/evidence-view.component';

export {
  DisputeItemComponent,
  DisputeListComponent,

  IssueItemComponent,
  FormIssueNotesComponent,

  FormEvidenceComponent,
  SelectIssueDialogComponent,
  EvidenceComponent,
  NoEvidenceComponent,
  EvidenceViewComponent,
  EvidenceInlineFormComponent,

  NoPersonInDocumentComponent,
  SelectPersonDialogComponent,
  PersonDetailComponent,

  FormDocumentMetadataComponent,
  DocumentTableComponent,
  FileUploadComponent,

  EmptySentencesComponent,
  PleadingItemComponent,
  AddSentencesDialogComponent,
  SentenceComponent,
  EditSentenceDialogComponent,
  UnassignIssueFromSentenceDialogComponent,
  EditPleadingDialogComponent,
  ParagraphViewComponent,

  ListChronologiesComponent,
  ListEventComponent,
  FormCreateComponent,

  IssuePreviewItemComponent
};

export const components: Array<any> = [
  DisputeItemComponent,
  DisputeListComponent,

  IssueItemComponent,
  FormIssueNotesComponent,

  FormEvidenceComponent,
  SelectIssueDialogComponent,
  EvidenceComponent,
  NoEvidenceComponent,
  EvidenceViewComponent,
  EvidenceInlineFormComponent,

  NoPersonInDocumentComponent,
  SelectPersonDialogComponent,
  PersonDetailComponent,

  FormDocumentMetadataComponent,
  DocumentTableComponent,
  FileUploadComponent,

  EmptySentencesComponent,
  PleadingItemComponent,
  AddSentencesDialogComponent,
  SentenceComponent,
  EditSentenceDialogComponent,
  UnassignIssueFromSentenceDialogComponent,

  ListChronologiesComponent,
  ListEventComponent,
  FormCreateComponent,
  PleadingListComponent,
  IssueTreeNodeComponent,
  IssueTreeComponent,
  EditPleadingDialogComponent,
  ParagraphViewComponent,

  TopNavBarComponent,
  TopBarComponent,

  IssuePreviewItemComponent,
  IssuePleadingsComponent
];

export const entryComponents: Array<any> = [
  SelectIssueDialogComponent,
  SelectPersonDialogComponent,
  AddSentencesDialogComponent,
  EditSentenceDialogComponent,
  UnassignIssueFromSentenceDialogComponent,
  EditPleadingDialogComponent
];
