// Interfaces & configs
import { serverUrl } from "../constants/config";
import { ISharecountForm } from "../interfaces/interfaces";

export const getSharecountsService = () => {
  return fetch(`${serverUrl}/sharecounts`)
    .then((res) => res.json())
    .then(
      (result) => {
        return result;
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
      (result) => {
        return result;
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
      (result) => {
        return result;
      },
      (error) => {
        return error;
      }
    );
};

export const addSharecountService = (sharecount: ISharecountForm) => {
  return fetch(`${serverUrl}/sharecount-with-partcipants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sharecount),
  })
    .then((res) => res.json())
    .then(
      (result) => {
        return result;
      },
      (error) => {
        return error;
      }
    );
};

export const editSharecountService = (sharecount: ISharecountForm) => {
  return fetch(`${serverUrl}/sharecount-with-partcipants/${sharecount.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sharecount),
  })
    .then((res) => res.json())
    .then(
      (result) => {
        return result;
      },
      (error) => {
        return error;
      }
    );
};
