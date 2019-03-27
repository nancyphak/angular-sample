import { Get, Post } from '../helper';
import * as fixtures from '../../fixtures/pleadings.json';

export class PleadingsRoute {

  @Get('api/qry/FindParagraphsByDispute/*')
  public static findParagraphsByDispute() {
    return {response: <Array<any>>fixtures};
  }

  @Get('api/qry/FindParagraphsByDispute/*')
  public static findPleadingsByDisputeAndReturnEmpty() {
    return {response: []};
  }

  @Post('api/cmd/CreateParagraph')
  public static createParagraph() {
    return {response: {}};
  }

  @Post('api/cmd/CreateResponse')
  public static createResponse() {
    return {response: {}};
  }

  @Post('api/cmd/RenameParagraph')
  public static renameParagraph() {
    return {response: {}};
  }

  @Post('api/cmd/RenameResponse')
  public static renameResponse() {
    return {response: {}};
  }

  @Post('api/cmd/AddParagraphSentences')
  public static addParagraphSentences() {
    return {response: {}};
  }

  @Post('api/cmd/AddResponseSentences')
  public static addResponseSentences() {
    return {response: {}};
  }

  @Post('api/cmd/DeleteParagraph')
  public static deleteParagraph() {
    return {response: {}};
  }

  @Post('api/cmd/DeleteResponse')
  public static deleteResponse() {
    return {response: {}};
  }

  @Post('api/cmd/DeleteSentence')
  public static deleteSentence() {
    return {response: {}};
  }

  @Post('api/cmd/UpdateSentenceText')
  public static updateSentenceText() {
    return {response: {}};
  }

  @Post('api/svc/SplitSentence')
  public static splitSentence(res: any) {
    return {response: res};
  }

  @Post('api/cmd/AddIssueIdsToSentence')
  public static assignSentenceToIssue() {
    return {response: {}};
  }

  @Post('api/cmd/RemoveSentencesFromIssue')
  public static removeSentencesFromIssue() {
    return {response: {}};
  }
}
