// Interfaces & configs
import {
  IPartakerResponse,
  ISharecountContext,
  IParticipantsContext,
  IExpenseContext,
  IExpenseResponse,
  IPartakersContext,
  IExpenseForm,
} from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import NotLoggedIn from "../components/Common/NotLoggedIn";
import ModalContent from "../components/Common/ModalContent";
import ExpenseInfoForm from "../components/Expenses/ExpenseInfoForm";
import PartakersList from "../components/Expenses/PartakersList";

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
import { Button, Modal } from "@mui/material";

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

  useEffect(() => {
    let currentSharecount = sharecountsContext.find(
      (s) => s.id === parseInt(params.sharecountID!)
    );
    let currentExpense = currentSharecount?.expenses?.find(
      (e) => e.id === parseInt(params.expenseID!)
    );
    if (currentSharecount?.participants && currentExpense) {
      setParticipants(currentSharecount.participants!);
      setOldAmount(currentExpense.amount_total);
      formik.setFieldValue("expenseName", currentExpense.name);
      formik.setFieldValue("expenseAmount", currentExpense.amount_total);
      setExpenseDate(moment(currentExpense.date));
      setOwnerID(currentExpense.owner.id);
      setSelectedParticipantsIDs(
        currentExpense.partakers.map((p: IPartakersContext) => p.id)
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
        (expense: IExpenseResponse) => {
          setOldAmount(expense.amount_total);
          formik.setFieldValue("expenseName", expense.name);
          formik.setFieldValue("expenseAmount", expense.amount_total);
          setExpenseDate(moment(expense.date));
          setOwnerID(expense.owner_id);
          setSelectedParticipantsIDs(
            expense.partakers.map((p: IPartakerResponse) => p.participant_id)
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

    const newExpense: IExpenseForm = {
      id: parseInt(params.expenseID!),
      name: expenseNew.expenseName,
      amount_total: parseInt(expenseNew.expenseAmount),
      date: moment(expenseDate).format(),
      owner_id: ownerID,
      partakers: selectedParticipantsIDs.map((p: number) => {
        return {
          participant_id: p,
          amount:
            parseInt(expenseNew.expenseAmount) / selectedParticipantsIDs.length,
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
        partakers: expense.partakers.map((p: IPartakerResponse) => ({
          id: p.participant_id,
          name: p.participant.name,
          amount: p.amount,
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
          <ExpenseInfoForm
            formik={formik}
            onSave={(expense: { expenseName: string; expenseAmount: string }) =>
              save(expense)
            }
            expenseDate={expenseDate}
            onHandleDateChange={handleDateChange}
            ownerID={ownerID}
            onHandleOwnerChange={handleOwnerChange}
            participants={participants}
          ></ExpenseInfoForm>
          <PartakersList
            errorMissingPartakers={errorMissingPartakers}
            selectedParticipantsIDs={selectedParticipantsIDs}
            participants={participants}
            selectAll={selectAll}
            onHandleCheckAll={handleCheckAll}
            onHandleCheckChange={handleCheckChange}
          ></PartakersList>
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
          <div>
            <ModalContent
              onSetDisplayModal={(bool: boolean) => setDisplayModal(bool)}
              onConfirmDelete={() => confirmDelete()}
            ></ModalContent>
          </div>
        </Modal>
      </div>
    );
  }
};

export default ExpenseEdit;
