// Interfaces & configs
import { serverUrl } from "../constants/config";
import { IExpenseForm } from "../interfaces/interfaces";

export const getExpenseService = (expenseID: number) => {
  console.log("getExpenseService");
  return fetch(`${serverUrl}/expense/${expenseID}`)
    .then((res) => res.json())
    .then(
      (expense) => {
        return expense;
      },
      (error) => {
        return error;
      }
    );
};

export const deleteExpenseService = (expenseID: number) => {
  console.log("deleteExpenseService");
  return fetch(`${serverUrl}/expense/${expenseID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(
      (expense) => {
        return expense;
      },
      (error) => {
        return error;
      }
    );
};

export const addExpenseService = (expense: IExpenseForm) => {
  console.log("addExpenseService");
  return fetch(`${serverUrl}/expense`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  })
    .then((res) => res.json())
    .then(
      (expense) => {
        return expense;
      },
      (error) => {
        return error;
      }
    );
};

export const editExpenseService = (expense: IExpenseForm) => {
  console.log("editExpenseService");
  return fetch(`${serverUrl}/expense/${expense.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  })
    .then((res) => res.json())
    .then(
      (expense) => {
        return expense;
      },
      (error) => {
        return error;
      }
    );
};
