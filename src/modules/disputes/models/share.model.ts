export interface ShareDisputeModel {
  id?: string;
  disputeId?: string;
  email?: string;
  user?: string;
  status?: string;
  index?: number;
}

export interface CreateShareDisputeModel {
  id: string;
  disputeId: string;
  email: string;
  status: string;
}

export interface DeleteShareDisputeModel {
  id: string;
  disputeId: string;
}
