import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { TextField } from "@mui/material";
import { IExpense } from "../interfaces/interfaces";
import moment from "moment";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import Loader from "../components/Loader";

const ExpenseEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [expense, setExpense] = useState<IExpense | undefined>(undefined);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = React.useState<moment.Moment | null>(moment());

  useEffect(() => {
    fetch(`http://localhost:3000/expense/${params.id}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setExpense(result);
          setName(result.name);
          setAmount(result.amount_total);
          setDate(result.date);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [params.id]);

  const handleDateChange = (newDate: moment.Moment | null) => {
    setDate(newDate);
  };

  const editExpenseServer = (expense: any) => {
    return fetch(`http://localhost:3000/expense/${params.id}`, {
      method: "PUT",
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
    };
    editExpenseServer(newExpense);
  };

  if (error) {
    return (
      <div>
        <Header title="Edit Expense" backButton="true"></Header>
        Please try again later
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        <Header title="Edit Expense"></Header>
        <Loader></Loader>
      </div>
    );
  } else {
    return (
      <div>
        <Header
          title="Edit Expense"
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
  }
};

export default ExpenseEdit;
