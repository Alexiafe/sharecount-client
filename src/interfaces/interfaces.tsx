export interface ISharecount {
  id: number;
  name: string;
  currency: string;
  created_at?: Date;
  updated_at?: Date;
  participants?: IParticipant[];
}

export interface IParticipant {
  id: number;
  name: string;
  sharecount_id: number;
  checked?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface IExpenseInfo {
  id: number;
  amount: number;
  expense_id: number;
  participant_id: number;
  participant: IParticipant;
  created_at?: Date;
  updated_at?: Date;
}

export interface IExpense {
  id: number;
  name: string;
  amount_total: number;
  date: string;
  sharecount_id?: number;
  owner_id?: number;
  expense_info?: IExpenseInfo[];
  created_at?: Date;
  updated_at?: Date;
}
