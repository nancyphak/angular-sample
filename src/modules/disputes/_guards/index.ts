import { DisputeExistsGuards } from './dispute-exists.guard';
import { UnSavedGuard } from './un-saved.guard';
import { IssueExistsGuard } from './issue-exists.guard';
import { DocumentMetadataGuard } from './document-metadata.guard';
import { EvidenceExistsGuard } from './evidence-exists.guard';
import { PleadingsExistsGuard } from './pleadings-exists.guard';
import { ChronologiesExistsGuard } from './chronogolies-exists.guard';
import { PeopleExistsGuard } from './people-exists.guard';
import { DocumentsLoadedGuard } from './documents-loaded.guard';
import { IssueEmptyGuard } from './issue-empty.guard';

export {
  DisputeExistsGuards,
  UnSavedGuard,
  IssueExistsGuard,
  IssueEmptyGuard,
  DocumentMetadataGuard,
  EvidenceExistsGuard,
  PleadingsExistsGuard,
  ChronologiesExistsGuard,
  PeopleExistsGuard,
  DocumentsLoadedGuard
};

export const guards: Array<any> = [
  DisputeExistsGuards,
  UnSavedGuard,
  IssueExistsGuard,
  IssueEmptyGuard,
  DocumentMetadataGuard,
  EvidenceExistsGuard,
  PleadingsExistsGuard,
  ChronologiesExistsGuard,
  PeopleExistsGuard,
  DocumentsLoadedGuard
];
