// Interfaces & configs
import { serverUrl } from "../constants/config";
import {
  ISharecountForm,
  IUserInSharecountDataForm,
} from "../interfaces/interfaces";

export const getSharecountService = (sharecountID: number) => {
  return fetch(`${serverUrl}/sharecount/${sharecountID}`)
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

export const addSharecountService = (sharecount: ISharecountForm) => {
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
