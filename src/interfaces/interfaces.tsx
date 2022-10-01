export interface ISharecountResponse {
  id: number;
  name: string;
  currency: string;
  expenses?: IExpenseResponse[];
  participants?: IParticipantResponse[];
  created_at: Date;
  updated_at: Date;
}

export interface ISharecountForm {
  id?: number;
  name: string;
  currency: string;
  participants?: string[];
}

export interface IExpenseResponse {
  id: number;
  name: string;
  amount_total: number;
  date: string;
  sharecount?: ISharecountResponse;
  sharecount_id: number;
  owner?: IParticipantResponse;
  owner_id: number;
  participants?: IParticipantResponse[];
  expense_info?: IExpenseInfoResponse[];
  created_at: Date;
  updated_at: Date;
}

export interface IExpenseForm {
  id?: number;
  name: string;
  amount_total: number;
  date: string;
  sharecount?: ISharecountForm;
  sharecount_id?: number;
  owner?: IParticipantForm;
  owner_id: number;
  participants?: IParticipantForm[];
  expense_info?: IExpenseInfoForm[];
}

export interface IParticipantResponse {
  id: number;
  name: string;
  sharecount?: ISharecountResponse;
  sharecount_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IParticipantForm {
  id?: number;
  name: string;
  sharecount?: ISharecountResponse;
  sharecount_id: number;
  checked?: boolean;
}

export interface IExpenseInfoResponse {
  id: number;
  amount: number;
  expense?: IExpenseResponse;
  expense_id: number;
  participant?: IParticipantResponse;
  participant_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IExpenseInfoForm {
  id?: number;
  amount: number;
  expense?: IExpenseResponse;
  expense_id?: number;
  participant?: IParticipantResponse;
  participant_id?: number;
}
