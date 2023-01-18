// Interfaces & configs
import {
  ISharecountContext,
  IParticipantsContext,
  IExpenseContext,
  IPartakersContext,
  IExpenseForm,
} from "../../interfaces/interfaces";

// Context
import SharecountsContext from "../../context/sharecounts.context";

// Components
import HeaderThin from "../Common/HeaderThin";
import Loader from "../Common/Loader";
import ModalContent from "../Common/ModalContent";
import ExpenseInfoForm from "./ExpenseInfoForm";
import PartakersList from "./PartakersList";

// Servives
import {
  deleteExpenseService,
  editExpenseService,
} from "../../services/expense.service";

// React
import React, { useContext, useEffect, useState } from "react";

// MUI
import { Button, Modal } from "@mui/material";

// Other
import moment from "moment";
import { useFormik } from "formik";
import * as yup from "yup";

interface IPropsExpenseEditModal {
  sharecount?: ISharecountContext;
  expense?: IExpenseContext;
  onReturn?: () => void;
  onCloseAllModals?: () => void;
  onEditExpense?: (expense: IExpenseContext) => void;
  onDeleteExpense?: (expense: IExpenseContext) => void;
}

const ExpenseEditModal = (props: IPropsExpenseEditModal) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
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
  const { sharecountsContext } = useContext(SharecountsContext);
  const header = `Edit expense`;

  useEffect(() => {
    if (props.sharecount?.participants && props.expense) {
      setParticipants(props.sharecount.participants!);
      setOldAmount(props.expense.amount_total);
      formik.setFieldValue("expenseName", props.expense.name);
      formik.setFieldValue("expenseAmount", props.expense.amount_total);
      setExpenseDate(moment(props.expense.date));
      setOwnerID(props.expense.owner.id);
      setSelectedParticipantsIDs(
        props.expense.partakers.map((p: IPartakersContext) => p.id)
      );
    }
  }, [props]);

  const handleCloseModal = () => setDisplayModal(false);

  const confirmDelete = () => {
    deleteExpense(props.expense?.id!);
    setDisplayModal(false);
  };

  const deleteExpense = (expense_id: number) => {
    setIsLoaded(false);
    deleteExpenseService(expense_id).then(
      (expenseResponse: IExpenseContext) => {
        props.onCloseAllModals?.();
        props.onDeleteExpense?.(expenseResponse);

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

  const save = (expense: { expenseName: string; expenseAmount: string }) => {
    setIsLoaded(false);
    const newExpense: IExpenseForm = {
      id: props.expense?.id!,
      name: expense.expenseName,
      amount_total: parseInt(expense.expenseAmount),
      date: moment(expenseDate).format(),
      owner_id: ownerID,
      partakers: selectedParticipantsIDs.map((p: number) => {
        return {
          participant_id: p,
          amount:
            parseInt(expense.expenseAmount) / selectedParticipantsIDs.length,
        };
      }),
    };

    editExpenseService(newExpense).then((expenseResponse: IExpenseContext) => {
      props.onReturn?.();
      props.onEditExpense?.(expenseResponse);
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

  if (!isLoaded) {
    return (
      <div>
        <HeaderThin title={header}></HeaderThin>
        <Loader></Loader>
      </div>
    );
  } else {
    return (
      <div className="h-screen flex flex-col">
        <HeaderThin
          title={header}
          cancelButton={true}
          saveButton={true}
          onCancel={() => props.onReturn?.()}
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

export default ExpenseEditModal;
