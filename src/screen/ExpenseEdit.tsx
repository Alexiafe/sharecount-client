// Interfaces & configs
import {
  IPartakerResponse,
  ISharecountContext,
  IParticipantsContext,
  IExpenseContext,
  IExpenseResponse,
  IPartakersContext,
} from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import Header from "../components/Header";
import Loader from "../components/Loader";
import NotLoggedIn from "../components/NotLoggedIn";

// Servives
import {
  deleteExpenseService,
  editExpenseService,
  getExpenseService,
} from "../services/expense.service";
import { getSharecountService } from "../services/sharecount.service";

// React
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Modal,
  TextField,
  Typography,
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
  const [oldAmount, setOldAmount] = useState<number>(0);
  const [ownerID, setOwnerID] = useState<number>(0);
  const [participants, setParticipants] = useState<IParticipantsContext[]>([]);
  const [selectedParticipantsIDs, setSelectedParticipantsIDs] = useState<
    number[]
  >([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [errorMissingPartakers, setErrorMissingPartakers] =
    useState<string>("");
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;

  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);

  const header = `Edit expense`;

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    textAlign: "center",
    p: 4,
  };

  useEffect(() => {
    let currentSharecount = sharecountsContext.find(
      (sharecount) => sharecount.id === parseInt(params.sharecountID!)
    );
    let currentExpense = currentSharecount?.expenses?.find(
      (expense) => expense.id === parseInt(params.expenseID!)
    );
    if (currentSharecount?.participants && currentExpense) {
      setParticipants(currentSharecount.participants!);
      setOldAmount(currentExpense.amount_total);
      formik.setFieldValue("expenseName", currentExpense.name);
      formik.setFieldValue("expenseAmount", currentExpense.amount_total);
      setExpenseDate(moment(currentExpense.date));
      setOwnerID(currentExpense.owner.id);
      setSelectedParticipantsIDs(
        currentExpense.partakers.map(
          (partaker: IPartakersContext) => partaker.id
        )
      );
      setIsLoaded(true);
    } else {
      getSharecountService(parseInt(params.sharecountID!)).then(
        (sharecount: ISharecountContext) => {
          setParticipants(sharecount.participants!);
          setIsLoaded(true);
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );
      getExpenseService(parseInt(params.expenseID!)).then(
        (expense) => {
          setOldAmount(expense.amount_total);
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
          setError(error);
          setIsLoaded(true);
        }
      );
    }
  }, [params.expenseID, params.sharecountID]);

  const handleCloseModal = () => setDisplayModal(false);

  const confirmDelete = () => {
    deleteExpense(Number(params.expenseID));
    setDisplayModal(false);
  };

  const deleteExpense = (expense_id: number) => {
    setIsLoaded(false);
    deleteExpenseService(expense_id).then(
      () => {
        navigate(`/sharecount/${params.sharecountID}`);
        let currentSharecount = sharecountsContext.find(
          (s) => s.id === parseInt(params.sharecountID!)
        );
        currentSharecount!.total = currentSharecount!.total - oldAmount;
        currentSharecount!.expenses = currentSharecount!.expenses!.filter(
          (e) => e.id !== expense_id
        );
        setIsLoaded(true);
      },
      (error) => {
        setError(error);
        setIsLoaded(true);
      }
    );
  };

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

  const save = (expenseNew: { expenseName: string; expenseAmount: string }) => {
    setIsLoaded(false);

    const newExpense = {
      id: parseInt(params.expenseID!),
      name: expenseNew.expenseName,
      amount_total: parseInt(expenseNew.expenseAmount),
      date: moment(expenseDate).format(),
      owner_id: ownerID,
      partakers: selectedParticipantsIDs.map((p: number) => {
        return {
          amount:
            parseInt(expenseNew.expenseAmount) / selectedParticipantsIDs.length,
          participant_id: p,
        };
      }),
    };

    editExpenseService(newExpense).then((expense: IExpenseResponse) => {
      navigate(
        `/sharecount/${params.sharecountID}/expense/${params.expenseID}`
      );
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
      currentSharecount!.total =
        currentSharecount!.total - oldAmount + expense.amount_total;
      currentSharecount!.expenses = currentSharecount!.expenses!.filter(
        (e) => e.id !== expense.id
      );
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

  let modalContent = (
    <Box sx={style}>
      <Typography variant="h6" sx={{ m: 2 }}>
        Confirm delete?
      </Typography>
      <div className="flex justify-around">
        <div>
          <Button
            variant="outlined"
            sx={{ width: 100, margin: 0 }}
            onClick={() => setDisplayModal(false)}
          >
            Cancel
          </Button>
        </div>
        <div>
          <Button
            variant="outlined"
            sx={{ width: 100, margin: 0 }}
            onClick={() => confirmDelete()}
          >
            Delete
          </Button>
        </div>
      </div>
    </Box>
  );

  if (!isLoaded || userLoading) {
    return (
      <div>
        <Header title={header} cancelButton={true} saveButton={true}></Header>
        <Loader></Loader>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Header
          title={header}
          backButton={true}
          onReturn={() =>
            navigate(
              `/sharecount/${params.sharecountID}/expense/${params.expenseID}`
            )
          }
        ></Header>
        Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div className="h-screen flex flex-col">
        <Header
          title={header}
          cancelButton={true}
          saveButton={true}
          onReturn={() =>
            navigate(
              `/sharecount/${params.sharecountID}/expense/${params.expenseID}`
            )
          }
          onClick={() => formik.handleSubmit()}
        ></Header>
        <div className="flex flex-1 flex-col p-4 overflow-auto">
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
            <div className="text-xs text-red-600">{errorMissingPartakers}</div>
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
        <footer className="flex w-full pb-6 justify-center">
          <Button
            variant="outlined"
            color="error"
            sx={{ width: 200, margin: 2 }}
            onClick={() => setDisplayModal(true)}
          >
            Delete
          </Button>
        </footer>
        <Modal open={displayModal} onClose={handleCloseModal}>
          {modalContent}
        </Modal>
      </div>
    );
  }
};

export default ExpenseEdit;
