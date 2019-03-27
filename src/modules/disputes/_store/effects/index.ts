import { DisputesEffects } from './disputes.effect';
import { IssuesEffects } from './issues.effect';
import { DocumentsEffects } from './documents.effect';
import { EvidenceEffects } from './evidence.effect';
import { PeopleEffects } from './people.effect';
import { PleadingsEffects } from './pleadings.effect';
import { ChronologiesEffects } from './chronologies.effect';
import { UploadEffects } from './file-upload.effect';
import { SharesEffects } from './shares.effect';

export {
  DisputesEffects,
  IssuesEffects,
  DocumentsEffects,
  EvidenceEffects,
  PeopleEffects,
  PleadingsEffects,
  ChronologiesEffects,
  UploadEffects,
  SharesEffects
};

export const effects: Array<any> = [
  DisputesEffects,
  IssuesEffects,
  DocumentsEffects,
  EvidenceEffects,
  PeopleEffects,
  PleadingsEffects,
  ChronologiesEffects,
  UploadEffects,
  SharesEffects
];
