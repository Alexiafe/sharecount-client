// Interfaces
import { IParticipantResponse } from "../interfaces/interfaces";

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
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  TextField,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";

// Other
import moment from "moment";
import { useFormik } from "formik";
import * as yup from "yup";

const ExpenseAdd = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [expenseDate, setExpenseDate] = useState<moment.Moment | null>(
    moment()
  );
  const [ownerID, setOwnerID] = useState<number>(0);
  const [participants, setParticipants] = useState<IParticipantResponse[]>([]);
  const [partakersIDs, setPartakersIDs] = useState<number[]>([]);
  const [errorMissingPartakers, setErrorMissingPartakers] =
    useState<string>("");
  const header = `New expense`;

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (sharecount) => {
        setIsLoaded(true);
        setParticipants(sharecount.participants);
        setOwnerID(sharecount.participants[0].id);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [params.sharecountID]);

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
    const newExpense = {
      name: expense.expenseName,
      amount_total: parseInt(expense.expenseAmount),
      date: moment(expenseDate).format(),
      sharecount_id: parseInt(params.sharecountID!),
      owner_id: ownerID,
      partakers: partakersIDs.map((p: number) => {
        return {
          amount: parseInt(expense.expenseAmount) / partakersIDs.length,
          participant_id: p,
        };
      }),
    };

    setIsLoaded(false);
    addExpenseService(newExpense).then(() => {
      setIsLoaded(true);
      navigate(`/sharecount/${params.sharecountID}`);
    });
  };

  const listParticipants = participants.map((p: IParticipantResponse) => (
    <li key={p.id}>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              value={p.id}
              checked={partakersIDs.includes(p.id)}
              onChange={handleCheckChange}
            />
          }
          label={p.name}
        />
      </FormGroup>
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

      if (data.expenseAmount.trim().length === 0)
        errors.expenseAmount = "Amount is required";

      return errors;
    },
    onSubmit: (expense) => {
      if (partakersIDs.length === 0) {
        setErrorMissingPartakers("Please select at least one participants");
      } else {
        save(expense);
        formik.resetForm();
      }
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
        <div className="flex flex-col p-4">
          <form className="flex flex-col" onSubmit={formik.handleSubmit}>
            <div className="py-2">
              <TextField
                required
                fullWidth
                id="expenseName"
                name="expenseName"
                label="Name"
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
            <div className="py-2">
              <TextField
                required
                fullWidth
                id="expenseAmount"
                name="expenseAmount"
                label="Amount"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
          <div className="py-2">
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
          <div className="py-2">
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
          <div className="py-2">
            From whom:
            <div className="text-xs" style={{ color: "#d32f2f" }}>
              {errorMissingPartakers}
            </div>
            <ul>{listParticipants}</ul>
          </div>
        </div>
      </div>
    );
  }
};

export default ExpenseAdd;
