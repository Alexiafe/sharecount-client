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

export const getSharecountService = (sharecountID: number) => {
  console.log("getSharecountService");
  return fetch(`${serverUrl}/sharecount/${sharecountID}`)
    .then((res) => res.json())
    .then(
      (sharecount: ISharecountResponse) => {
        let parsedSharecount: ISharecountContext = {
          id: sharecount.id,
          name: sharecount.name,
          currency: sharecount.currency,
          total: sharecount.total,
          user: sharecount.userInSharecount[0]?.participant?.name,
          balance: sharecount.userInSharecount[0]?.participant?.balance,
          participants: sharecount.participants!.map(
            (participant: IParticipantResponse) => ({
              id: participant.id,
              name: participant.name,
              balance: participant.balance,
            })
          ),
          expenses: sharecount.expenses!.map((expense: IExpenseResponse) => ({
            id: expense.id,
            name: expense.name,
            amount_total: expense.amount_total,
            date: expense.date,
            owner: {
              id: expense.owner.id,
              name: expense.owner.name,
            },
            partakers: expense.partakers.map((partaker: IPartakerResponse) => ({
              id: partaker.participant_id,
              name: partaker.participant.name,
              amount: partaker.amount,
            })),
          })),
        };
        return parsedSharecount;
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
      (sharecount) => {
        return sharecount;
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
      (sharecount) => {
        return sharecount;
      },
      (error) => {
        return error;
      }
    );
};

export const removeUserFromSharecount = (
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
