export class FileUpload {
  public disputeId?: string;
  public id: string;
  public file?: File;
  public fileName: string;
  public fileType: string;
  public isSuccess = false;
  public isCancel ? = false;
  public isError ? = false;
  public progress = 0;
  public error?: string;
}

