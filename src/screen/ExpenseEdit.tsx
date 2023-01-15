// Interfaces & configs
import {
  ISharecountContext,
  IParticipantsContext,
  IExpenseContext,
  IPartakersContext,
  IExpenseForm,
} from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import HeaderThin from "../components/Common/HeaderThin";
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
        (sharecountResponse: ISharecountContext) => {
          setParticipants(sharecountResponse.participants!);
          setIsLoaded(true);
        },
        (error) => {
          console.log(error);
          setError(error);
          setIsLoaded(true);
        }
      );
      getExpenseService(parseInt(params.expenseID!)).then(
        (expenseResponse: IExpenseContext) => {
          setOldAmount(expenseResponse.amount_total);
          formik.setFieldValue("expenseName", expenseResponse.name);
          formik.setFieldValue("expenseAmount", expenseResponse.amount_total);
          setExpenseDate(moment(expenseResponse.date));
          setOwnerID(expenseResponse.owner.id);
          setSelectedParticipantsIDs(
            expenseResponse.partakers.map((p: IPartakersContext) => p.id)
          );
          setIsLoaded(true);
        },
        (error) => {
          console.log(error);
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
      (expenseResponse: IExpenseContext) => {
        navigate(`/sharecount/${params.sharecountID}`);
        let currentSharecount = sharecountsContext.find(
          (s) => s.id === parseInt(params.sharecountID!)
        );
        currentSharecount!.expenses = currentSharecount!.expenses!.filter(
          (e) => e.id !== expense_id
        );
        currentSharecount!.total = expenseResponse.sharecount!.total;
        currentSharecount!.participants =
          expenseResponse.sharecount!.participants;
        let me = currentSharecount!.participants?.find(
          (p) => p?.name === currentSharecount!.user
        );
        currentSharecount!.balance = me!.balance;

        setIsLoaded(true);
      },
      (error) => {
        console.log(error);
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

    editExpenseService(newExpense).then((expenseResponse: IExpenseContext) => {
      navigate(
        `/sharecount/${params.sharecountID}/expense/${params.expenseID}`
      );
      let currentSharecount = sharecountsContext.find(
        (s) => s.id === parseInt(params.sharecountID!)
      );
      currentSharecount!.expenses = currentSharecount!.expenses!.filter(
        (e) => e.id !== expenseResponse.id
      );
      currentSharecount?.expenses?.push(expenseResponse);
      currentSharecount!.total = expenseResponse.sharecount!.total;
      currentSharecount!.participants =
        expenseResponse.sharecount!.participants;
      let me = currentSharecount!.participants?.find(
        (p) => p?.name === currentSharecount!.user
      );
      currentSharecount!.balance = me!.balance;
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
        <HeaderThin
          title={header}
          cancelButton={true}
          saveButton={true}
        ></HeaderThin>
        <Loader></Loader>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <HeaderThin
          title={header}
          cancelButton={true}
          onCancel={() =>
            navigate(
              `/sharecount/${params.sharecountID}/expense/${params.expenseID}`
            )
          }
        ></HeaderThin>
        Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div className="h-screen flex flex-col">
        <HeaderThin
          title={header}
          cancelButton={true}
          saveButton={true}
          onCancel={() =>
            navigate(
              `/sharecount/${params.sharecountID}/expense/${params.expenseID}`
            )
          }
          onSave={() => formik.handleSubmit()}
        ></HeaderThin>
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
