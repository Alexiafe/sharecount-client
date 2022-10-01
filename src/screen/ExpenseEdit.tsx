// Interfaces & configs
import {
  IExpenseInfoResponse,
  IParticipantResponse,
  IParticipantForm,
  IExpenseForm,
} from "../interfaces/interfaces";

// Components
import Loader from "../components/Loader";
import Header from "../components/Header";

// Servives
import {
  editExpenseService,
  getExpenseService,
} from "../services/expense.service";
import { deleteExpenseInfoService } from "../services/expense_info.service";
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
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<moment.Moment | null>(moment());

  const [participants, setParticipants] = useState<IParticipantForm[]>([]);
  const [ownerID, setOwnerID] = useState<number>(0);

  const [participantsIDs, setParticipantsIDs] = useState<number[]>([]);

  const header = `Edit expense`;

  useEffect(() => {
    getExpenseService(parseInt(params.expenseID!)).then(
      (result1) => {
        setIsLoaded(true);
        setName(result1.name);
        setAmount(result1.amount_total);
        setDate(result1.date);
        setOwnerID(result1.owner.id);
        getSharecountService(parseInt(params.sharecountID!)).then(
          (result2) => {
            setIsLoaded(true);
            setParticipants(
              result2.participants.map((p: IParticipantResponse) => ({
                ...p,
                checked: result1?.expense_info?.some(
                  (e: IExpenseInfoResponse) => e.participant?.id === p.id
                )
                  ? true
                  : false,
              }))
            );
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [params.expenseID, params.sharecountID]);

  const handleDateChange = (newDate: moment.Moment | null) => {
    setDate(newDate);
  };

  const handleOwnerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerID(parseInt(event.target.value));
  };

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setParticipantsIDs([...participantsIDs, parseInt(event.target.value)]);
    } else {
      setParticipantsIDs(
        participantsIDs.filter((p) => p !== parseInt(event.target.value))
      );
    }

    let index = participants.findIndex(
      (p) => p.id === parseInt(event.target.value)
    );
    let newParticipants = [...participants];
    newParticipants[index].checked = event.target.checked;
    setParticipants(newParticipants);
  };

  const save = () => {
    let newExpense: IExpenseForm = {
      id: parseInt(params.expenseID!),
      name: name,
      amount_total: parseInt(amount),
      date: moment(date).format(),
      owner_id: ownerID,
      expense_info: participantsIDs.map((p: number) => {
        return {
          amount:
            parseInt(amount) / participants.filter((p) => p.checked).length,
          participant_id: p,
        };
      }),
    };

    let partcipantsToRemove: IParticipantForm[] = participants.filter(
      (p) => !p.checked
    );

    if (partcipantsToRemove.length)
      deleteExpenseInfoService(partcipantsToRemove);

    editExpenseService(newExpense).then(() =>
      navigate(`/sharecount/${params.sharecountID}`)
    );
  };

  const listParticipants = participants.map((p: IParticipantForm) => (
    <li key={p.id}>
      <Checkbox value={p.id} checked={p.checked} onChange={handleCheckChange} />{" "}
      {p.name}
    </li>
  ));

  if (error) {
    console.log(error);
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
