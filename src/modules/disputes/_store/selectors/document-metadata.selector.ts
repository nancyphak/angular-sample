import { createSelector } from '@ngrx/store';

import { selectCurrentDocument, selectDocumentMetadataByDispute } from './documents.selector';
import { selectPeopleByDispute } from './people.selector';

export const selectDocumentMetadata = createSelector(
  selectCurrentDocument,
  selectDocumentMetadataByDispute,
  selectPeopleByDispute,
  (selectedDocument, listMetadata, people) => {
    if (!selectedDocument) {
      return null;
    }
    const metadata = listMetadata.find(item => item.documentId === selectedDocument.id);
    people = people.filter((person) => {
      return (person.documentIds && person.documentIds.some((documentId) => documentId === selectedDocument.id));
    });
    if (!metadata) {
      return {
        metadata: { documentId: selectedDocument.id },
        document: selectedDocument,
        people: people.map(person => person.name).join(', '),
        peopleIds: people.map(person => person.id)
      };
    }
    return {
      metadata: metadata,
      document: selectedDocument,
      people: people.map(person => person.name).join(', '),
      peopleIds: people.map(person => person.id)
    };
  }
);
