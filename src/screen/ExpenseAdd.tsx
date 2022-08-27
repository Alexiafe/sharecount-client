import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import Header from "../components/Header";

const ExpenseAdd = () => {
  const navigate = useNavigate();
  const params = useParams();

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
      <Header title="New Expense"></Header>
      <br />
      <div className="flex flex-col">
        <div className="m-2">
          <TextField
            required
            fullWidth
            size="small"
            label="Title"
            variant="outlined"
            value={title}
            type="number"
            onChange={(e) => {
              setTitle(e.target.value);
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
        <div className="flex m-2">
          <div>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
          <div className="mx-2">
            <Button variant="outlined" size="small" onClick={() => save()}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAdd;
