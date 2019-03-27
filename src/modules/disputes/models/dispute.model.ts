export interface Dispute {
  id?: string;
  name?: string;
  timeCreated?: string;
  role?: string;
}

export interface UpdateDisputeModel {
  disputeId: string;
  newName: string;
}
