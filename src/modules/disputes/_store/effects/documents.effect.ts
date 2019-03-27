import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, timer } from 'rxjs';
import { catchError, map, switchMap, mapTo, withLatestFrom, filter } from 'rxjs/operators';

import { appConfig } from '@app/config';
import { DocumentService } from '../../services';
import {
  DeleteDocumentModel, DocumentMetadata, DocumentMetadataResponse, DocumentModel,
  RenameDocumentModel
} from '../../models';
import * as documentsActions from '../actions/documents.action';
import * as actionTypes from '../actions/document-action-type';
import { Undo, getRouterState } from '../../../app/_store';
import * as fromStore from '../index';

@Injectable()
export class DocumentsEffects {

  constructor(private actions$: Actions,
    private store: Store<fromStore.DisputeState>,
    private documentService: DocumentService) {
  }

  @Effect()
  getDocumentMetadataByDispute$ = this.actions$.pipe(
    ofType(
      actionTypes.GET_DOCUMENT_METADATA_BY_DISPUTE,
      actionTypes.GET_DOCUMENT_METADATA_BY_DISPUTE_SILENT
    ),
    map((action: documentsActions.GetDocumentMetadataByDispute) => action.payload),
    switchMap((payload) => {
      return this.documentService
        .getDocumentMetadataByDispute(payload.disputeId)
        .pipe(
          map((res: Array<DocumentMetadataResponse>) => {
            const documentMetadata: Array<DocumentMetadata> = res.map((item: DocumentMetadataResponse) => {
              return {
                ...item,
                disputeId: payload.disputeId
              };
            });
            return new documentsActions.GetDocumentMetadataByDisputeSuccess({
              documentMetadata: documentMetadata,
              disputeIdOfDocumentMetadataEntries: payload.disputeId
            });
          }),
          catchError((error) => of(new documentsActions.GetDocumentMetadataByDisputeFail(error)))
        );
    })
  );

  @Effect()
  onGetDocumentMetadataByDisputeSuccess$ = this.actions$.pipe(
    ofType(actionTypes.GET_DOCUMENT_METADATA_BY_DISPUTE_SUCCESS),
    map((action: documentsActions.GetDocumentMetadataByDisputeSuccess) => action.payload),
    switchMap((payload) => {
      return timer(appConfig.getDataSilentTimer).pipe(
        mapTo(payload.disputeIdOfDocumentMetadataEntries)
      );
    }),
    withLatestFrom(this.store.pipe(select(getRouterState))),
    filter(([disputeId, routerState]) => {
      return routerState.state.url.includes(disputeId);
    }),
    map(([disputeId]) => {
      return new documentsActions.GetDocumentMetadataByDisputeSilent({ disputeId });
    })
  );

  @Effect()
  setDocumentMetadata$ = this.actions$.pipe(
    ofType(actionTypes.SET_DOCUMENT_METADATA),
    map((action: documentsActions.SetDocumentMetadata) => action.payload),
    switchMap((metadata: DocumentMetadata) => {
      return this.documentService
        .setDocumentMetadata(metadata)
        .pipe(
          map((res) => {
            return new documentsActions.SetDocumentMetadataSuccess(res);
          }),
          catchError((error) => of(new documentsActions.SetDocumentMetadataFail(error)))
        );
    })
  );

  @Effect()
  getDocumentsByDispute$ = this.actions$.pipe(
    ofType(
      actionTypes.GET_DOCUMENTS_BY_DISPUTE,
      actionTypes.GET_DOCUMENTS_BY_DISPUTE_SILENT
    ),
    map((action: documentsActions.GetDocumentsByDispute) => action),
    switchMap((action) => {
      return this.documentService
        .getDocumentsByDispute(action.payload.disputeId)
        .pipe(
          map(documents => {
            if (documents && documents.length > 0) {
              documents = documents.map(e => {
                return {
                  ...e,
                  disputeId: action.payload.disputeId,
                  description: e.name.substring(0, e.name.lastIndexOf('.')),
                  extension: e.name.substring(e.name.lastIndexOf('.') + 1)
                };
              });
            }
            return new documentsActions.GetDocumentsByDisputeSuccess({
              documents: documents,
              disputeIdOfDocumentEntries: action.payload.disputeId
            });
          }),
          catchError(() => of(new documentsActions.GetDocumentsByDisputeFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  onGetDocumentsByDisputeSuccess$ = this.actions$.pipe(
    ofType(actionTypes.GET_DOCUMENTS_BY_DISPUTE_SUCCESS),
    map((action: documentsActions.GetDocumentsByDisputeSuccess) => action.payload),
    switchMap((payload) => {
      return timer(appConfig.getDataSilentTimer).pipe(
        mapTo(payload.disputeIdOfDocumentEntries)
      );
    }),
    withLatestFrom(this.store.pipe(select(getRouterState))),
    filter(([disputeId, routerState]) => {
      return routerState.state.url.includes(disputeId);
    }),
    map(([disputeId]) => {
      return new documentsActions.GetDocumentsByDisputeSilent({ disputeId });
    })
  );

  @Effect()
  setDocumentDescription$ = this.actions$.pipe(
    ofType(actionTypes.SET_DOCUMENT_DESCRIPTION),
    map((action: documentsActions.SetDocumentDescription) => action.payload),
    switchMap((document: DocumentModel) => {
      const model: RenameDocumentModel = {
        documentId: document.id,
        disputeId: document.disputeId,
        newName: `${document.description}.${document.extension}`
      };
      return this.documentService
        .renameDocument(model)
        .pipe(
          map((res) => new documentsActions.SetDocumentDescriptionSuccess(res)),
          catchError((error) => of(new documentsActions.SetDocumentDescriptionFail(error)))
        );
    })
  );

  @Effect()
  deleteDocument$ = this.actions$.pipe(
    ofType(actionTypes.DELETE_DOCUMENT),
    map((action: documentsActions.DeleteDocument) => action),
    switchMap((action) => {
      const data: DeleteDocumentModel = {
        documentId: action.payload.id,
        disputeId: action.payload.disputeId
      };
      return this.documentService
        .deleteDocumentInHouse(data).pipe(
          map(() => new documentsActions.DeleteDocumentSuccess(action.payload)),
          catchError(() => of(new documentsActions.DeleteDocumentFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  handleSetDocumentMetadataFail$ = this.actions$.pipe(
    ofType(actionTypes.SET_DOCUMENT_METADATA_FAIL),
    map(() => new Undo(actionTypes.SET_DOCUMENT_METADATA))
  );

  @Effect()
  handleSetDocumentDescriptionFail$ = this.actions$.pipe(
    ofType(actionTypes.SET_DOCUMENT_DESCRIPTION_FAIL),
    map(() => new Undo(actionTypes.SET_DOCUMENT_DESCRIPTION))
  );

  @Effect()
  handleDeleteFail$ = this.actions$.pipe(
    ofType(actionTypes.DELETE_DOCUMENT_FAIL),
    map(() => new Undo(actionTypes.DELETE_DOCUMENT))
  );

}
