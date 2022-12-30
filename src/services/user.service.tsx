// Interfaces & configs
import { serverUrl } from "../constants/config";
import {
  IUserInSharecountResponse,
  IUserResponse,
} from "../interfaces/interfaces";

const parseUser = (user: IUserResponse) => {
  let parsedSharecounts = user?.userInSharecount.map(
    (u: IUserInSharecountResponse) => ({
      id: u.sharecount.id,
      name: u.sharecount.name,
      currency: u.sharecount.currency,
      total: u.sharecount.total,
      user: u.participant.name,
      balance: u.participant.balance,
    })
  );
  return parsedSharecounts;
};

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
        return parseUser(user);
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
