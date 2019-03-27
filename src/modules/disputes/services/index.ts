import { DisputesService } from './disputes.service';
import { IssuesService } from './issues.service';
import { EvidencesService } from './evidences.service';
import { PeopleService } from './people.service';
import { DocumentService } from './document.service';
import { PleadingsService } from './pleadings.service';
import { ChronologiesService } from './chronologies.service';
import { UploadService } from './file-upload.service';
import { DragDropService } from '../components/issue-tree/drag-drop.service';
import { SharesService } from './shares.service';
import { IssuesEventService } from './issues-event.service';

export {
  DisputesService,
  IssuesService,
  EvidencesService,
  PeopleService,
  DocumentService,
  PleadingsService,
  ChronologiesService,
  UploadService,
  SharesService,
  IssuesEventService
};

export const services: Array<any> = [
  DisputesService,
  IssuesService,
  EvidencesService,
  PeopleService,
  DocumentService,
  PleadingsService,
  ChronologiesService,
  UploadService,
  DragDropService,
  IssuesEventService
];
