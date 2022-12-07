export interface ISharecountResponse {
  id: number;
  name: string;
  currency: string;
  total: number;
  expenses?: IExpenseResponse[];
  participants?: IParticipantResponse[];
  userInSharecount: IUserInSharecountResponse[];
  created_at: Date;
  updated_at: Date;
}

export interface ISharecountForm {
  id?: number;
  name?: string;
  currency?: string;
  participantsToAdd?: string[];
  participantsToDelete?: string[];
  user_email?: string;
  participant_id?: number;
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
  partakers?: IPartakerResponse[];
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
  partakers?: IPartakerForm[];
}

export interface IParticipantResponse {
  id: number;
  name: string;
  sharecount?: ISharecountResponse;
  sharecount_id: number;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export interface IParticipantForm {
  id?: number;
  name: string;
  sharecount?: ISharecountResponse;
  sharecount_id: number;
}

export interface IUserInSharecountResponse {
  participant?: { name: string; balance: number };
  user?: { email: string };
  sharecount?: ISharecountResponse;
}

export interface IPartakerResponse {
  expense_id: number;
  participant_id: number;
  amount: number;
  participant: IParticipantResponse;
  created_at: Date;
  updated_at: Date;
}

export interface IPartakerForm {
  expense_id?: number;
  participant_id: number;
  amount: number;
  participant?: IParticipantResponse;
}

export interface IUserInSharecountDataForm {
  sharecount_id: number;
  user_email: string;
}
