// Interfaces & configs
import {
  IParticipantResponse,
  IExpenseForm,
  IPartakerResponse,
} from "../interfaces/interfaces";

// Components
import Loader from "../components/Loader";
import Header from "../components/Header";

// Servives
import {
  editExpenseService,
  getExpenseService,
} from "../services/expense.service";
import { getSharecountService } from "../services/sharecount.service";

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

const ExpenseEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState<moment.Moment | null>(
    moment()
  );
  const [participants, setParticipants] = useState<IParticipantResponse[]>([]);
  const [partakersIDs, setPartakersIDs] = useState<number[]>([]);
  const [ownerID, setOwnerID] = useState<number>(0);
  const header = `Edit expense`;

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (sharecount) => {
        setParticipants(sharecount.participants);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
    getExpenseService(parseInt(params.expenseID!)).then(
      (expense) => {
        setExpenseName(expense.name);
        setExpenseAmount(expense.amount_total);
        setExpenseDate(moment(expense.date));
        setOwnerID(expense.owner_id);
        setPartakersIDs(
          expense.partakers.map(
            (partaker: IPartakerResponse) => partaker.participant_id
          )
        );
        setIsLoaded(true);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [params.expenseID, params.sharecountID]);

  const handleDateChange = (newDate: moment.Moment | null) => {
    setExpenseDate(newDate);
  };

  const handleOwnerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerID(parseInt(event.target.value));
  };

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setPartakersIDs([...partakersIDs, parseInt(event.target.value)]);
    } else {
      setPartakersIDs(
        partakersIDs.filter((p) => p !== parseInt(event.target.value))
      );
    }
  };

  const save = () => {
    let newExpense: IExpenseForm = {
      id: parseInt(params.expenseID!),
      name: expenseName,
      amount_total: parseInt(expenseAmount),
      date: moment(expenseDate).format(),
      owner_id: ownerID,
      partakers: partakersIDs.map((p: number) => {
        return {
          amount: parseInt(expenseAmount) / partakersIDs.length,
          participant_id: p,
        };
      }),
    };

    editExpenseService(newExpense).then(() =>
      navigate(`/sharecount/${params.sharecountID}`)
    );
  };

  const listParticipants = participants.map((p: IParticipantResponse) => (
    <li key={p.id}>
      <Checkbox
        value={p.id}
        checked={partakersIDs.includes(p.id)}
        onChange={handleCheckChange}
      />
      {p.name}
    </li>
  ));

  if (error) {
    return (
      <div>
        <Header title={header} backButton={true}></Header>
        Please try again later
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        <Header title={header}></Header>
        <Loader></Loader>
      </div>
    );
  } else {
    return (
      <div>
        <Header
          title={header}
          cancelButton={true}
          saveButton={true}
          onClick={save}
        ></Header>
        <div className="flex flex-col m-2">
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
              value={expenseAmount}
              onChange={(e) => {
                setExpenseAmount(e.target.value);
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
                value={expenseDate}
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

export default ExpenseEdit;
