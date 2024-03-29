// Interfaces
import {
  ISharecountContext,
  IExpenseContext,
  IParticipantsContext,
  IExpenseForm,
} from "../../interfaces/interfaces";

// Context
import SharecountsContext from "../../context/sharecounts.context";

// Components
import HeaderThin from "../Common/HeaderThin";
import Loader from "../Common/Loader";
import ExpenseInfoForm from "./ExpenseInfoForm";
import PartakersList from "./PartakersList";

// Services
import { addExpenseService } from "../../services/expense.service";

// React
import React, { useContext, useEffect, useState } from "react";

// Other
import moment from "moment";
import { useFormik } from "formik";
import * as yup from "yup";

interface IPropsExpenseAddModal {
  sharecount?: ISharecountContext;
  expense?: IExpenseContext;
  onReturn?: () => void;
  onAddExpense?: (expense: IExpenseContext) => void;
}

const ExpenseAddModal = (props: IPropsExpenseAddModal) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
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
  const { sharecountsContext } = useContext(SharecountsContext);
  const header = `New expense`;

  useEffect(() => {
    if (
      props.sharecount?.participants &&
      props.sharecount?.participants?.length > 0
    ) {
      setParticipants(props.sharecount.participants);
      setOwnerID(props.sharecount.participants[0].id);
      setSelectedParticipantsIDs(
        props.sharecount.participants.map((p: IParticipantsContext) => p.id)
      );
    }
  }, [props]);

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
      sharecount_id: props.sharecount?.id,
      owner_id: ownerID,
      partakers: selectedParticipantsIDs.map((p: number) => {
        return {
          participant_id: p,
          amount:
            parseInt(expense.expenseAmount) / selectedParticipantsIDs.length,
        };
      }),
    };

    addExpenseService(newExpense).then((expenseResponse: IExpenseContext) => {
      props.onAddExpense?.(expenseResponse);
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

  if (!isLoaded) {
    return (
      <div>
        <HeaderThin title={header}></HeaderThin>
        <Loader></Loader>
      </div>
    );
  } else {
    return (
      <div>
        <HeaderThin
          title={header}
          cancelButton={true}
          saveButton={true}
          onCancel={() => props.onReturn?.()}
          onSave={() => formik.handleSubmit()}
        ></HeaderThin>
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

export default ExpenseAddModal;
