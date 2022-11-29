// Interfaces & configs
import { serverUrl } from "../constants/config";
import { ISharecountForm } from "../interfaces/interfaces";

export const getSharecountsService = (userEmail: string) => {
  return fetch(`${serverUrl}/sharecounts`, {
    headers: {
      Authorization: `${userEmail}`,
    },
  })
    .then((res) => res.json())
    .then(
      (sharecounts) => {
        return sharecounts;
      },
      (error) => {
        return error;
      }
    );
};

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

export const deleteSharecountService = (sharecountID: number) => {
  return fetch(`${serverUrl}/sharecount/${sharecountID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
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

export const addSharecountService = (
  userEmail: string,
  sharecount: ISharecountForm
) => {
  return fetch(`${serverUrl}/sharecount`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: userEmail,
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
