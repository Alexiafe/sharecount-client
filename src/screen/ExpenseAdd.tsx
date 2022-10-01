// Interfaces
import {
  IParticipantForm,
  IParticipantResponse,
} from "../interfaces/interfaces";

// Components
import Header from "../components/Header";
import Loader from "../components/Loader";

// Services
import { getSharecountService } from "../services/sharecount.service";
import { addExpenseService } from "../services/expense.service";

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
  const [ownerID, setOwnerID] = useState<number>(0);
  const [participants, setParticipants] = useState<IParticipantForm[]>([]);

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (result) => {
        setIsLoaded(true);
        setParticipants(
          result.participants.map((p: IParticipantResponse) => ({
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
    let newParticipants = [...participants];
    newParticipants[index].checked = event.target.checked;
    setParticipants(newParticipants);
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
    addExpenseService(newExpense).then(() =>
      navigate(`/sharecount/${params.sharecountID}`)
    );
  };

  const listParticipants = participants.map((p: IParticipantForm) => (
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
        <div className="flex flex-col p-3">
          <div className="m-2">
            <TextField
              required
              fullWidth
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
          <div className="m-2">
            <TextField
              required
              fullWidth
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
                  <TextField required fullWidth {...params} />
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
