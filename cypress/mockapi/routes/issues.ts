import { Get, Post } from '../helper';
import * as fixtures from '../../fixtures/issues.json';

export class IssuesRoute {

  @Get('api/qry/FindIssuesByDispute/*')
  public static findIssuesByDispute() {
    return {response: <Array<any>>fixtures};
  }

  @Get('api/qry/FindIssuesByDispute/*')
  public static findIssuesByDisputeAndReturnEmpty() {
    return {response: []};
  }

  @Post('api/cmd/CreateIssue')
  public static createIssue() {
    return {response: {}};
  }

  @Post('api/cmd/RenameIssue')
  public static renameIssue() {
    return {response: {}};
  }

  @Post('api/cmd/DeleteIssue')
  public static deleteIssue() {
    return {response: {}};
  }

  @Post('api/cmd/SetIssuePosition')
  public static setIssuePosition() {
    return {response: {}};
  }

  @Post('api/cmd/SetIssueNotes')
  public static setIssueNotes() {
    return {response: {}};
  }

  @Post('api/cmd/SetIssueNotesHeightPreference')
  public static setIssueNotesHeight() {
    return {response: {}};
  }
}
