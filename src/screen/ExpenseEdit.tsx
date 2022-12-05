// Interfaces & configs
import {
  IParticipantResponse,
  IPartakerResponse,
} from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";

// Components
import Loader from "../components/Loader";
import Header from "../components/Header";
import NotLoggedIn from "../components/NotLoggedIn";

// Servives
import {
  editExpenseService,
  getExpenseService,
} from "../services/expense.service";
import { getSharecountService } from "../services/sharecount.service";

// React
import React, { useContext, useEffect, useState } from "react";
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

const ExpenseEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [expenseDate, setExpenseDate] = useState<moment.Moment | null>(
    moment()
  );
  const [ownerID, setOwnerID] = useState<number>(0);
  const [participants, setParticipants] = useState<IParticipantResponse[]>([]);
  const [selectedParticipantsIDs, setSelectedParticipantsIDs] = useState<
    number[]
  >([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [errorMissingPartakers, setErrorMissingPartakers] =
    useState<string>("");
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;
  const header = `Edit expense`;

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (sharecount) => {
        setIsLoaded(true);
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
        setSelectedParticipantsIDs(
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

  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedParticipantsIDs(participants.map((p) => p.id));
      setSelectAll(true);
    } else {
      setSelectedParticipantsIDs([]);
      setSelectAll(false);
    }
  };

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedParticipantsIDs([
        ...selectedParticipantsIDs,
        parseInt(event.target.value),
      ]);
      if (
        [...selectedParticipantsIDs, parseInt(event.target.value)].length ===
        participants.length
      ) {
        setSelectAll(true);
      }
    } else {
      setSelectAll(false);
      setSelectedParticipantsIDs(
        selectedParticipantsIDs.filter(
          (p) => p !== parseInt(event.target.value)
        )
      );
    }
  };

  const save = (expense: { expenseName: string; expenseAmount: string }) => {
    const newExpense = {
      id: parseInt(params.expenseID!),
      name: expense.expenseName,
      amount_total: parseInt(expense.expenseAmount),
      date: moment(expenseDate).format(),
      owner_id: ownerID,
      partakers: selectedParticipantsIDs.map((p: number) => {
        return {
          amount:
            parseInt(expense.expenseAmount) / selectedParticipantsIDs.length,
          participant_id: p,
        };
      }),
    };

    setIsLoaded(false);
    editExpenseService(newExpense).then(() => {
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
              checked={
                selectAll ? true : selectedParticipantsIDs.includes(p.id)
              }
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

      if (data.expenseAmount.length === 0)
        errors.expenseAmount = "Amount is required";

      return errors;
    },
    onSubmit: (expense) => {
      if (selectedParticipantsIDs.length === 0) {
        setErrorMissingPartakers("Please select at least one participants");
      } else {
        save(expense);
        formik.resetForm();
      }
    },
  });

  if (!isLoaded || userLoading) {
    return (
      <div>
        <Header title={header}></Header>
        <Loader></Loader>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Header title={header} backButton={true}></Header>
        Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
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
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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
            <Checkbox
              checked={
                selectedParticipantsIDs.length === participants.length ||
                selectAll
              }
              onChange={handleCheckAll}
              style={{ width: "20px", padding: 0 }}
            />
            <ul>{listParticipants}</ul>
          </div>
        </div>
      </div>
    );
  }
};

export default ExpenseEdit;
