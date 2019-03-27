import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import * as fromChronologies from '../reducers/chronologies.reducer';
import * as fromFeature from '../reducers';
import { selectCurrentDisputeId } from './disputes.selector';
import { selectDocumentMetadataByDispute, selectDocumentsByDispute } from './documents.selector';
import { EventModel, EventTypes } from '../../models';

export const selectChronologiesState = createSelector(
  fromFeature.getDisputeState,
  (state: fromFeature.DisputeState) => state.chronologies);

export const {
  selectAll: selectAllChronologies
} = fromChronologies.adapter.getSelectors(selectChronologiesState);

export const selectChronologyByDisputeId = createSelector(
  selectAllChronologies,
  selectCurrentDisputeId,
  (chronologies, disputeId) => {
    return chronologies.filter((chronology) => {
      return chronology.disputeId && chronology.disputeId.toString() === disputeId;
    });
  }
);

export const selectEventsByDisputeId = createSelector(
  selectChronologyByDisputeId,
  selectDocumentMetadataByDispute,
  selectDocumentsByDispute,
  (customEvents, documentMetadataArray, documents) => {
    let dEvents: Array<EventModel> = [];
    if (documents && documents.length > 0) {
      const documentEntities = {};
      documents.forEach(item => {
        documentEntities[item.id] = item;
      });

      dEvents = documentMetadataArray
        .filter(documentEvent => {
          if (!documentEvent.date || !documentEntities[documentEvent.documentId]) {
            return false;
          }
          const date = new Date(documentEvent.date);
          return date && date.getFullYear() > 1;
        })
        .map(event => {
          const document = documents.find(doc => doc.id === event.documentId);
          return {
            id: event.documentId,
            disputeId: event.disputeId,
            description: !!document ? document.description : '',
            date: event.date,
            day: new Date(event.date).getDate(),
            year: new Date(event.date).getFullYear().toString(),
            month: (new Date(event.date).getUTCMonth() + 1).toString(),
            type: EventTypes.documentEvent
          };
        });
    }

    const cEvents: Array<EventModel> = customEvents.map(event => {
      return {
        id: event.id,
        disputeId: event.disputeId,
        description: event.description,
        date: event.date,
        day: new Date(event.date).getDate(),
        year: new Date(event.date).getFullYear().toString(),
        month: (new Date(event.date).getUTCMonth() + 1).toString(),
        type: EventTypes.customEvent
      };
    });

    const events = _.concat(cEvents, dEvents);
    const groupYear = _.groupBy(events, 'year');
    const arr = Object.keys(groupYear).map(year => groupYear[year]);

    return arr.map(year => {
      const y = _.groupBy(year, 'month');
      return Object.keys(y).map(m => {
        return _.sortBy(y[m], ['day']);
      });
    });
  }
);

export const selectChronologiesLoading = createSelector(
  selectChronologiesState,
  fromChronologies.getChronologiesLoading
);
export const selectChronologiesLoaded = createSelector(
  selectChronologiesState,
  fromChronologies.getChronologiesLoaded
);

export const selectChronologyError = createSelector(
  selectChronologiesState,
  fromChronologies.getError
);

export const selectDisputeIdOfChronologiesEntries = createSelector(
  selectChronologiesState,
  fromChronologies.getDisputeIdOfEntries
);
