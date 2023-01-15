// Interfaces & configs
import { serverUrl } from "../constants/config";
import {
  ISharecountContext,
  IExpenseResponse,
  IPartakerResponse,
  IParticipantResponse,
  ISharecountForm,
  ISharecountResponse,
  IUserInSharecountDataForm,
} from "../interfaces/interfaces";

const parseSharecount = (sharecount: ISharecountResponse) => {
  let parsedSharecount: ISharecountContext = {
    id: sharecount.id,
    name: sharecount.name,
    currency: sharecount.currency,
    total: sharecount.total,
    user: sharecount.userInSharecount![0]?.participant?.name,
    balance: sharecount.userInSharecount![0]?.participant?.balance,
    participants: sharecount.participants?.map((p: IParticipantResponse) => ({
      id: p.id,
      name: p.name,
      balance: p.balance,
    })),
    expenses: sharecount.expenses?.map((e: IExpenseResponse) => ({
      id: e.id,
      name: e.name,
      amount_total: e.amount_total,
      date: e.date,
      owner: {
        id: e.owner.id,
        name: e.owner.name,
      },
      partakers: e.partakers.map((p: IPartakerResponse) => ({
        id: p.participant_id,
        name: p.participant.name,
        amount: p.amount,
      })),
    })),
  };
  return parsedSharecount;
};

export const getSharecountService = (sharecountID: number) => {
  console.log("getSharecountService");
  return fetch(`${serverUrl}/sharecount/${sharecountID}`)
    .then((res) => res.json())
    .then(
      (sharecount: ISharecountResponse) => {
        return parseSharecount(sharecount);
      },
      (error) => {
        return error;
      }
    );
};

export const addSharecountService = (sharecount: ISharecountForm) => {
  console.log("addSharecountService");
  return fetch(`${serverUrl}/sharecount`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sharecount),
  })
    .then((res) => res.json())
    .then(
      (sharecount: ISharecountResponse) => {
        return parseSharecount(sharecount);
      },
      (error) => {
        return error;
      }
    );
};

export const editSharecountService = (sharecount: ISharecountForm) => {
  console.log("editSharecountService");
  return fetch(`${serverUrl}/sharecount/${sharecount.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sharecount),
  })
    .then((res) => res.json())
    .then(
      (sharecount: ISharecountResponse) => {
        return parseSharecount(sharecount);
      },
      (error) => {
        return error;
      }
    );
};

export const removeUserFromSharecountService = (
  userInSharecountData: IUserInSharecountDataForm
) => {
  console.log("removeUserFromSharecount");
  return fetch(`${serverUrl}/userInSharecountData`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInSharecountData),
  })
    .then((res) => res.json())
    .then(
      (res) => {
        return res;
      },
      (error) => {
        return error;
      }
    );
};
