import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const ExpenseAdd = () => {
  const navigate = useNavigate();
  let params = useParams();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const addExpense = (expense: any) => {
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
      name: title,
      amount_total: parseInt(amount),
      sharecount: parseInt(params.id!),
    };
    addExpense(newExpense);
    navigate(-1);
  };

  return (
    <div>
      New Expense
      <br />
      <div className="flex flex-col">
        <div className=" m-2">
          <TextField
            size="small"
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className=" m-2">
          <TextField
            size="small"
            label="Amount"
            variant="outlined"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </div>
        <div className=" m-2">
          <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="outlined" size="small" onClick={() => save()}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAdd;
