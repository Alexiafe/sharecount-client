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
import { useFormik } from "formik";
import * as yup from "yup";

const ExpenseEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
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
        formik.setFieldValue("expenseName", expense.name);
        formik.setFieldValue("expenseAmount", expense.amount_total);
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

  const save = (expense: { expenseName: string; expenseAmount: string }) => {
    let newExpense: IExpenseForm = {
      id: parseInt(params.expenseID!),
      name: expense.expenseName,
      amount_total: parseInt(expense.expenseAmount),
      date: moment(expenseDate).format(),
      owner_id: ownerID,
      partakers: partakersIDs.map((p: number) => {
        return {
          amount: parseInt(expense.expenseAmount) / partakersIDs.length,
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

  const validationSchema = yup.object({
    expenseName: yup.string().required(),
    expenseAmount: yup
      .number()
      .positive()
      .required()
      .typeError("Amount should be a positive number"),
  });

  const formik = useFormik({
    initialValues: {
      expenseName: "",
      expenseAmount: "",
    },
    validationSchema: validationSchema,
    validate: (data) => {
      let errors: any = {};

      if (data.expenseName.trim().length === 0)
        errors.expenseName = "Name is required";

      if (data.expenseAmount.length === 0)
        errors.expenseAmount = "Amount is required";

      return errors;
    },
    onSubmit: (expense) => {
      save(expense);
      formik.resetForm();
    },
  });

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
          onClick={() => formik.handleSubmit()}
        ></Header>
        <div className="flex flex-col p-3">
          <form className="flex flex-col" onSubmit={formik.handleSubmit}>
            <div className="m-2">
              <TextField
                required
                fullWidth
                id="expenseName"
                name="expenseName"
                label="Name"
                variant="outlined"
                value={formik.values.expenseName}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.expenseName &&
                  Boolean(formik.errors.expenseName)
                }
                helperText={
                  formik.touched.expenseName && formik.errors.expenseName
                }
              />
            </div>
            <div className="m-2">
              <TextField
                required
                fullWidth
                id="expenseAmount"
                name="expenseAmount"
                label="Amount"
                variant="outlined"
                value={formik.values.expenseAmount}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.expenseAmount &&
                  Boolean(formik.errors.expenseAmount)
                }
                helperText={
                  formik.touched.expenseAmount && formik.errors.expenseAmount
                }
              />
            </div>
          </form>
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
