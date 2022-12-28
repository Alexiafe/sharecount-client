// Interfaces & configs
import { serverUrl } from "../constants/config";
import {
  IUserInSharecountResponse,
  IUserResponse,
} from "../interfaces/interfaces";

export const getUserService = (userEmail: string) => {
  console.log("getUserService");
  return fetch(`${serverUrl}/user/${userEmail}`)
    .then((res) => {
      return res.text();
    })
    .then((data) => {
      return data ? JSON.parse(data) : null;
    })
    .then(
      (user: IUserResponse) => {
        let parsedSharecounts = user?.userInSharecount.map(
          (userInSharecount: IUserInSharecountResponse) => ({
            id: userInSharecount.sharecount.id,
            name: userInSharecount.sharecount.name,
            currency: userInSharecount.sharecount.currency,
            total: userInSharecount.sharecount.total,
            user: userInSharecount.participant.name,
            balance: userInSharecount.participant.balance,
          })
        );
        return parsedSharecounts;
      },
      (error) => {
        return error;
      }
    );
};

export const addUserService = (userEmail: string) => {
  console.log("addUserService");
  return fetch(`${serverUrl}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: userEmail }),
  })
    .then((res) => res.json())
    .then(
      (user) => {
        return user;
      },
      (error) => {
        return error;
      }
    );
};
