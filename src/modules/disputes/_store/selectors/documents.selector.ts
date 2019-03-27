import { createSelector } from '@ngrx/store';

import { selectActivatedRoute } from 'modules/app/_store';
import * as fromFeature from '../reducers';
import * as fromDocuments from '../reducers/documents.reducer';
import { DocumentModel } from '../../models';
import { documentTypes } from '../../constants';
import { selectCurrentDisputeId } from './disputes.selector';

export const selectDocumentsState = createSelector(
  fromFeature.getDisputeState,
  (state: fromFeature.DisputeState) => state.documents);

export const {
  selectAll: selectAllDocuments,
  selectEntities: selectDocumentEntities,
} = fromDocuments.adapter.getSelectors(selectDocumentsState);

export const selectDocumentLoading = createSelector(
  selectDocumentsState,
  fromDocuments.getDocumentLoading
);

export const selectDocumentsLoading = createSelector(
  selectDocumentsState,
  fromDocuments.getDocumentsLoading
);

export const selectDocumentsHaveLoad = createSelector(
  selectDocumentsState,
  fromDocuments.getHaveLoad
);

export const selectDisputeIdOfDocumentEntries = createSelector(
  selectDocumentsState,
  fromDocuments.getDisputeIdOfDocumentEntries
);

export const selectDisputeIdOfDocumentMetadataEntries = createSelector(
  selectDocumentsState,
  fromDocuments.getDisputeIdOfDocumentMetadataEntries
);

export const selectDocumentError = createSelector(
  selectDocumentsState,
  fromDocuments.getDocumentError
);

export const selectCurrentDocumentId = createSelector(
  selectDocumentsState,
  fromDocuments.getCurrentDocumentId
);

export const selectCurrentDocument = createSelector(
  selectDocumentEntities,
  selectCurrentDocumentId,
  selectActivatedRoute,
  (entities, id, route) => {
    if (route && route.params && route.params.documentId) {
      id = route.params.documentId;
    }
    return entities[id];
  }
);

export const selectAllDocumentMetadata = createSelector(
  selectDocumentsState,
  fromDocuments.getListDocumentMetadata
);

export const selectDocumentMetadataByDispute = createSelector(
  selectAllDocumentMetadata,
  selectCurrentDisputeId,
  (metadata, disputeId) => {
    return metadata.filter((meta) => {
      return meta.disputeId && meta.disputeId === disputeId;
    });
  }
);

const getDocumentMetadata = (documentId, listMetadata) => {
  return listMetadata.find((t) => t.documentId === documentId);

};

const getDocumentType = (typeId) => {
  const type = documentTypes.find((t) => t.id === typeId);
  return type ? type.name : '';
};

export const selectDocumentsByDispute = createSelector(
  selectAllDocuments,
  selectDocumentMetadataByDispute,
  selectCurrentDisputeId,
  (documents, listMetadata, disputeId): Array<DocumentModel> => {
    documents = documents.filter((document: DocumentModel) => document && document.disputeId === disputeId);
    if (!listMetadata || listMetadata.length <= 0) {
      return documents;
    }
    if (documents && listMetadata) {

      return documents.map((item: DocumentModel) => {
        const metadata = getDocumentMetadata(item.id, listMetadata);
        const documentType = metadata ? getDocumentType(metadata.typeId) : '';
        return {
          ...item,
          documentType: documentType
        };
      });
    }

    return [];
  }
);

export const selectCurrentSidekickDocument = createSelector(
  selectDocumentEntities,
  selectActivatedRoute,
  (entities, route) => {
    if (route) {
      return entities[route.params.sidekickDocumentId];
    }
    return null;
  }
);

export const selectSidekickDocumentMetadata = createSelector(
  selectCurrentSidekickDocument,
  selectDocumentMetadataByDispute,
  (document, listMetadata) => {
    if (document && listMetadata.length <= 0) {
      return {
        documentId: document.id
      };
    }
    if (document && listMetadata && listMetadata.length > 0) {
      const metadata = listMetadata.find(item => item.documentId === document.id);
      if (!metadata) {
        return {
          documentId: document.id
        };
      }
      return metadata;
    }
    return null;
  }
);

export const selectDocumentCurrentPageNumber = createSelector(
  selectDocumentsState,
  fromDocuments.getDocumentCurrentPageNumber
);

export const selectDocumentMetadataVisible = createSelector(
  selectDocumentsState,
  fromDocuments.getDocumentMetadataVisible
);

