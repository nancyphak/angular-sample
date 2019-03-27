import { Get, Post } from '../helper';
import * as documents from '../../fixtures/documents.json';
import * as metadata from '../../fixtures/metadata.json';

export class DocumentsRoute {

  @Get('api/qry/FindDocumentMetadataByDispute/*')
  public static findDocumentMetadataByDispute() {
    return {response: <Array<any>>metadata};
  }

  @Get('api/documents/ListDocumentFiles/*')
  public static listDocumentFiles() {
    return {response: <Array<any>>documents};
  }

  @Get('api/documents/ListDocumentFiles/*')
  public static listDocumentFilesAndReturnEmpty() {
    return {response: []};
  }

  @Get('api/documents/download/*/*/pdf')
  public static downloadDocument() {
    return {response: {}};
  }

  @Post('api/cmd/RenameDocument')
  public static renameDocument() {
    return {response: {}};
  }

  @Post('api/cmd/SetDocumentMetadata')
  public static setDocumentMetadata() {
    return {response: {}};
  }

  @Post('api/cmd/SetDocumentPeople')
  public static setDocumentPeople() {
    return {response: {}};
  }
}
