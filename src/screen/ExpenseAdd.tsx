import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  TextField } from "@mui/material";
import Header from "../components/Header";
import { IExpense } from "../interfaces/interfaces";

const ExpenseAdd = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const addExpenseServer = (expense: IExpense) => {
    return fetch("http://localhost:3000/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    }).then((data) => data.json());
  };

  const save = () => {
    const newExpense = {
      id: 0,
      name: name,
      amount_total: parseInt(amount),
      date: '',
      sharecount_id: parseInt(params.id!),
    };
    addExpenseServer(newExpense);
    navigate(-1);
  };

  return (
    <div>
      <Header
        title="New Expense"
        cancelButton="true"
        saveButton="true"
        onClick={save}
      ></Header>
      <div className="flex flex-col m-2">
        <div className="m-2">
          <TextField
            required
            fullWidth
            size="small"
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className=" m-2">
          <TextField
            required
            fullWidth
            size="small"
            label="Amount"
            variant="outlined"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseAdd;
