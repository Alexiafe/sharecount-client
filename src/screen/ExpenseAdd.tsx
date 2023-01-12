// Interfaces
import {
  ISharecountContext,
  IExpenseContext,
  IParticipantsContext,
  IExpenseForm,
} from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import NotLoggedIn from "../components/Common/NotLoggedIn";
import ExpenseInfoForm from "../components/Expenses/ExpenseInfoForm";
import PartakersList from "../components/Expenses/PartakersList";

// Services
import { getSharecountService } from "../services/sharecount.service";
import { addExpenseService } from "../services/expense.service";

// React
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
      (s) => s.id === parseInt(params.sharecountID!)
    );
    if (
      currentSharecount?.participants &&
      currentSharecount?.participants?.length > 0
    ) {
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
          if (sharecount.participants!.length > 0)
            setOwnerID(sharecount.participants![0].id);
          setSelectedParticipantsIDs(
            sharecount.participants!.map((p: IParticipantsContext) => p.id)
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

    const newExpense: IExpenseForm = {
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
          participant_id: p,
          amount:
            parseInt(expense.expenseAmount) / selectedParticipantsIDs.length,
        };
      }),
    };

    addExpenseService(newExpense).then((expense: IExpenseContext) => {
      navigate(`/sharecount/${params.sharecountID}`);
      let currentSharecount = sharecountsContext.find(
        (s) => s.id === parseInt(params.sharecountID!)
      );
      currentSharecount?.expenses?.push(expense);
      currentSharecount!.total = expense.sharecount!.total;
      currentSharecount!.participants = expense.sharecount!.participants;
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
      </div>
    );
  }
};

export default ExpenseAdd;
