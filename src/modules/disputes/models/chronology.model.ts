export interface Chronology {
  id: string;
  disputeId?: string;
  description: string;
  date: string;
  type?: EventTypes;
}

export interface EventModel {
  id: string;
  disputeId?: string;
  description: string;
  date: string;
  day?: number;
  year?: string;
  month?: string;
  type?: EventTypes;
}

export enum EventTypes {
  documentEvent = 'document event',
  customEvent = 'custom event'
}
