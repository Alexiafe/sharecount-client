import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import {TextField } from "@mui/material";

const ExpenseEdit = () => {

  const navigate = useNavigate();
  const params = useParams();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const editExpense = (expense: any) => {
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
      name: name,
      amount_total: parseInt(amount),
      sharecount: parseInt(params.id!),
    };
    editExpense(newExpense);
    navigate(-1);
  };

  return (
    <div>
      <Header title="Edit Expense" cancelButton="true" saveButton="true" onClick={save}></Header>
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

export default ExpenseEdit;
