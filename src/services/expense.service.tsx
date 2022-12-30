// Interfaces & configs
import { serverUrl } from "../constants/config";
import {
  IExpenseContext,
  IExpenseForm,
  IExpenseResponse,
  IPartakerResponse,
} from "../interfaces/interfaces";

const parseExpense = (expense: IExpenseResponse) => {
  let newExpenses: IExpenseContext = {
    id: expense.id,
    name: expense.name,
    amount_total: expense.amount_total,
    date: expense.date,
    owner: {
      id: expense.owner?.id,
      name: expense.owner?.name,
    },
    partakers: expense.partakers?.map((p: IPartakerResponse) => ({
      id: p.participant_id,
      name: p.participant.name,
      amount: p.amount,
    })),
  };
  return newExpenses;
};

export const getExpenseService = (expenseID: number) => {
  console.log("getExpenseService");
  return fetch(`${serverUrl}/expense/${expenseID}`)
    .then((res) => res.json())
    .then(
      (expense: IExpenseResponse) => {
        return parseExpense(expense);
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
      (expense: IExpenseResponse) => {
        return parseExpense(expense);
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
      (expense: IExpenseResponse) => {
        return parseExpense(expense);
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
      (expense: IExpenseResponse) => {
        return parseExpense(expense);
      },
      (error) => {
        return error;
      }
    );
};
