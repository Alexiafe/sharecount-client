import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField } from "@mui/material";
import Header from "../components/Header";
import moment from "moment";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";

const ExpenseAdd = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = React.useState<moment.Moment | null>(moment());

  const handleDateChange = (newDate: moment.Moment | null) => {
    setDate(newDate);
  };

  const addExpenseServer = (expense: any) => {
    return fetch("http://localhost:3000/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    }).then((data) => {
      data.json();
      navigate(-1);
    });
  };

  const save = () => {
    const newExpense = {
      name: name,
      amount_total: parseInt(amount),
      date: moment(date).format(),
      sharecount_id: parseInt(params.id!),
    };
    addExpenseServer(newExpense);
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
        <div className="m-2">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <MobileDatePicker
              label="Date"
              inputFormat="DD/MM/YYYY"
              value={date}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField required fullWidth size="small" {...params} />
              )}
            />
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAdd;
