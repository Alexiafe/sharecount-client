// Interfaces & configs
import { serverUrl } from "../constants/config";

export const getExpenseService = (expenseID: number) => {
  return fetch(`${serverUrl}/expense/${expenseID}`)
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

export const deleteExpenseService = (expenseID: number) => {
  return fetch(`${serverUrl}/expense/${expenseID}`, {
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

export const addExpenseService = (expense: any) => {
  return fetch(`${serverUrl}/expense`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
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

export const editExpenseService = (expense: any, expenseID: number) => {
  return fetch(`${serverUrl}/expense/${expenseID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
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
