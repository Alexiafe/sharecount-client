// Interfaces
import {
  ISharecountContext,
  IExpenseContext,
  IExpenseResponse,
  IPartakerResponse,
  IParticipantsContext,
} from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import Header from "../components/Header";
import Loader from "../components/Loader";
import NotLoggedIn from "../components/NotLoggedIn";

// Services
import { getSharecountService } from "../services/sharecount.service";
import { addExpenseService } from "../services/expense.service";

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

const ExpenseAdd = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [expenseDate, setExpenseDate] = useState<moment.Moment | null>(
    moment()
  );
  const [ownerID, setOwnerID] = useState<number>(0);
  const [participants, setParticipants] = useState<IParticipantsContext[]>([]);
  const [selectedParticipantsIDs, setSelectedParticipantsIDs] = useState<
    number[]
  >([]);
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const [errorMissingPartakers, setErrorMissingPartakers] =
    useState<string>("");
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;
  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);
  const header = `New expense`;

  useEffect(() => {
    let currentSharecount = sharecountsContext.find(
      (sharecount) => sharecount.id === parseInt(params.sharecountID!)
    );
    if (currentSharecount?.participants) {
      setParticipants(currentSharecount.participants);
      setOwnerID(currentSharecount.participants[0].id);
      setSelectedParticipantsIDs(
        currentSharecount.participants.map((p: IParticipantsContext) => p.id)
      );
      setIsLoaded(true);
    } else {
      getSharecountService(parseInt(params.sharecountID!)).then(
        (sharecount: ISharecountContext) => {
          setParticipants(sharecount.participants!);
          setOwnerID(sharecount.participants![0].id);
          setSelectedParticipantsIDs(
            sharecount.participants!.map((p: IParticipantsContext) => p.id)
          );
          setIsLoaded(true);
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );
    }
  }, [params.sharecountID]);

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
    setIsLoaded(false);

    const newExpense = {
      name: expense.expenseName,
      amount_total: parseInt(expense.expenseAmount),
      date: moment(expenseDate)
        ?.utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .format(),
      sharecount_id: parseInt(params.sharecountID!),
      owner_id: ownerID,
      partakers: selectedParticipantsIDs.map((p: number) => {
        return {
          amount:
            parseInt(expense.expenseAmount) / selectedParticipantsIDs.length,
          participant_id: p,
        };
      }),
    };

    addExpenseService(newExpense).then((expense: IExpenseResponse) => {
      navigate(`/sharecount/${params.sharecountID}`);
      let currentSharecount = sharecountsContext.find(
        (s) => s.id === parseInt(params.sharecountID!)
      );
      let newExpenses: IExpenseContext = {
        id: expense.id,
        name: expense.name,
        amount_total: expense.amount_total,
        date: expense.date,
        owner: {
          id: expense.owner.id,
          name: expense.owner.name,
        },
        partakers: expense.partakers.map((partaker: IPartakerResponse) => ({
          id: partaker.participant_id,
          name: partaker.participant.name,
          amount: partaker.amount,
        })),
      };
      console.log(currentSharecount)
      console.log(expense)  
      currentSharecount!.total = expense.sharecount.total;
      currentSharecount?.expenses?.push(newExpenses);
      setIsLoaded(true);
    });
  };

  const listParticipants = participants.map((p: IParticipantsContext) => (
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

      if (data.expenseAmount.trim().length === 0)
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
        <Header
          title={header}
          backButton={true}
          onReturn={() => navigate(`/sharecount/${params.sharecountID}`)}
        ></Header>
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
          onReturn={() => navigate(`/sharecount/${params.sharecountID}`)}
          onClick={() => formik.handleSubmit()}
        ></Header>
        <div className="flex flex-col p-4">
          <form className="flex flex-col" onSubmit={formik.handleSubmit}>
            <div className="py-2">
              <TextField
                fullWidth
                required
                autoFocus
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
            <div className="text-xs text-red-600">{errorMissingPartakers}</div>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      selectedParticipantsIDs.length === participants.length ||
                      selectAll
                    }
                    onChange={handleCheckAll}
                  />
                }
                label="Select all"
              />
            </FormGroup>
            <ul>{listParticipants}</ul>
          </div>
        </div>
      </div>
    );
  }
};

export default ExpenseAdd;
