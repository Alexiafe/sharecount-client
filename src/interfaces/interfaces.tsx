// CONTEXT

export interface ISharecountContext {
  // getUserService
  id: number;
  name: string;
  currency: string;
  total: number;
  user: string;
  balance: number;
  participants?: IParticipantsContext[]; // getSharecountService
  expenses?: IExpenseContext[]; // getSharecountService
}

export interface IParticipantsContext {
  id: number;
  name: string;
  balance: number;
}

export interface IExpenseContext {
  id: number;
  name: string;
  amount_total: number;
  date: string;
  sharecount?: ISharecountContext;
  owner: {
    id: number;
    name: string;
  };
  partakers: IPartakersContext[];
}

export interface IPartakersContext {
  id: number;
  name: string;
  amount: number;
}

// RESPONSE

export interface IUserResponse {
  email: string;
  userInSharecount: IUserInSharecountResponse[];
  created_at: Date;
  updated_at: Date;
}

export interface ISharecountResponse {
  id: number;
  name: string;
  currency: string;
  total: number;
  userInSharecount?: IUserInSharecountResponse[];
  participants?: IParticipantResponse[];
  expenses?: IExpenseResponse[];
  created_at: Date;
  updated_at: Date;
}

export interface IUserInSharecountResponse {
  user_email: string;
  sharecount_id: number;
  sharecount: ISharecountResponse;
  participant_id: number;
  participant: IParticipantResponse;
  created_at: Date;
  updated_at: Date;
}

export interface IParticipantResponse {
  id: number;
  name: string;
  balance: number;
  sharecount_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IExpenseResponse {
  id: number;
  name: string;
  amount_total: number;
  date: string;
  sharecount_id: number;
  sharecount: ISharecountResponse;
  owner_id: number;
  owner: IParticipantResponse;
  participants: IParticipantResponse[];
  partakers: IPartakerResponse[];
  created_at: Date;
  updated_at: Date;
}

export interface IPartakerResponse {
  expense_id: number;
  participant_id: number;
  amount: number;
  participant: IParticipantResponse;
  created_at: Date;
  updated_at: Date;
}

// FORM

export interface ISharecountForm {
  id?: number;
  name?: string;
  currency?: string;
  participantsToAdd?: string[];
  participantsToDelete?: string[];
  user_email?: string;
  participant_id?: number;
}

export interface IExpenseForm {
  id?: number;
  name: string;
  amount_total: number;
  date: string;
  sharecount_id?: number;
  owner_id: number;
  partakers: IPartakerForm[];
}

export interface IPartakerForm {
  participant_id: number;
  amount: number;
}

export interface IUserInSharecountDataForm {
  sharecount_id: number;
  user_email: string;
}
