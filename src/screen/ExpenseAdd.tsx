// Interfaces & configs
import { IParticipant } from "../interfaces/interfaces";
import { serverUrl } from "../constants/config";

// Components
import Header from "../components/Header";
import Loader from "../components/Loader";

// React
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import { Checkbox, MenuItem, TextField } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";

// Other
import moment from "moment";

const ExpenseAdd = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [expenseName, setExpenseName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<moment.Moment | null>(moment());
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [ownerID, setOwnerID] = useState<number>(0);

  useEffect(() => {
    fetch(`${serverUrl}/sharecount/${params.sharecountID}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setParticipants(
            result.participants.map((p: IParticipant) => ({
              ...p,
              checked: false,
            }))
          );
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [params.sharecountID]);

  const handleDateChange = (newDate: moment.Moment | null) => {
    setDate(newDate);
  };

  const handleOwnerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerID(parseInt(event.target.value));
  };

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let index = participants.findIndex(
      (p) => p.id === parseInt(event.target.value)
    );
    let newP = [...participants];
    newP[index].checked = event.target.checked;
    setParticipants(newP);
  };

  const addExpenseServer = (expense: any) => {
    return fetch(`${serverUrl}/expense`, {
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
      name: expenseName,
      amount_total: parseInt(amount),
      date: moment(date).format(),
      sharecount_id: parseInt(params.sharecountID!),
      owner_id: ownerID,
      expense_info: participants
        .filter((p) => p.checked)
        .map((p) => {
          return {
            amount:
              parseInt(amount) / participants.filter((p) => p.checked).length,
            participant_id: p.id,
          };
        }),
    };
    addExpenseServer(newExpense);
  };

  const listParticipants = participants.map((p: IParticipant) => (
    <li key={p.id}>
      <Checkbox value={p.id} checked={p.checked} onChange={handleCheckChange} />
      {p.name}
    </li>
  ));

  if (error) {
    return (
      <div>
        <Header title="New Expense"></Header>
        Please try again later
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        <Header title="New Expense"></Header>
        <Loader></Loader>
      </div>
    );
  } else {
    return (
      <div>
        <Header
          title="New Expense"
          cancelButton={true}
          saveButton={true}
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
              value={expenseName}
              onChange={(e) => {
                setExpenseName(e.target.value);
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
          <div className="m-2">
            <TextField
              fullWidth
              select
              label="Paid by:"
              value={ownerID || 0}
              onChange={handleOwnerChange}
            >
              {participants.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="m-2">
            From whom:
            <ul className="mt-2">{listParticipants}</ul>
          </div>
        </div>
      </div>
    );
  }
};

export default ExpenseAdd;
