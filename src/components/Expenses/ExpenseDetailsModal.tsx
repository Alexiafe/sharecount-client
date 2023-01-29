// Interfaces & configs
import {
  ISharecountContext,
  IExpenseContext,
  IPartakersContext,
} from "../../interfaces/interfaces";

// Context
import UserContext from "../../context/user.context";

// Components
import Header from "../Common/Header";
import ExpenseEditModal from "./ExpenseEditModal";

// React
import { useState, useContext } from "react";

// MUI
import { List, ListItem, ListItemText, Dialog } from "@mui/material";

// Other
import moment from "moment";

interface IPropsExpenseDetailsModal {
  sharecount?: ISharecountContext;
  expense?: IExpenseContext;
  onReturn?: () => void;
  onEditExpense?: (expense: IExpenseContext) => void;
  onDeleteExpense?: (expense: IExpenseContext) => void;
}

const ExpenseDetailsModal = (props: IPropsExpenseDetailsModal) => {
  const expense = props.expense;
  const sharecount = props.sharecount;
  const header = expense?.name;
  const date = moment(expense?.date).format("DD/MM/YYYY");

  const { userContext } = useContext(UserContext);

  const [displayModalExpenseEdit, setDisplayModalExpenseEdit] =
    useState<boolean>(false);

  const handleCloseModalExpenseEdit = () => setDisplayModalExpenseEdit(false);

  const listExpenseParticipants = expense?.partakers
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    .map((p: IPartakersContext) => (
      <li key={p.id}>
        <List disablePadding>
          <ListItem>
            <ListItemText
              primary={`
                ${p.name}
                ${p.name === userContext ? " (me) " : ""}`}
            />
            <ListItemText
              style={{ textAlign: "right" }}
              primary={`${p.amount.toFixed(2)} ${sharecount?.currency}`}
            />
          </ListItem>
        </List>
      </li>
    ));

  return (
    <div style={{ paddingTop: "170px", paddingBottom: "20px" }}>
      <Header
        title={header}
        id={Number(props.sharecount?.id)}
        expense_id={Number(props.expense?.id)}
        owner={expense?.owner?.name}
        amount_total={expense?.amount_total}
        currency={sharecount?.currency}
        date={date}
        backButton={true}
        screen="Details"
        onReturn={() => props.onReturn?.()}
        onTitleClick={() => {
          setDisplayModalExpenseEdit(true);
        }}
      ></Header>
      <div className=" relative items-center p-4">
        <div className="text-text">
          For {expense?.partakers.length} participants :
          <ul>{listExpenseParticipants}</ul>
        </div>
      </div>
      <Dialog
        fullScreen
        open={displayModalExpenseEdit}
        onClose={handleCloseModalExpenseEdit}
      >
        <ExpenseEditModal
          sharecount={props.sharecount}
          expense={props.expense}
          onReturn={handleCloseModalExpenseEdit}
          onCloseAllModals={props.onReturn}
          onEditExpense={props.onEditExpense}
          onDeleteExpense={props.onDeleteExpense}
        ></ExpenseEditModal>
      </Dialog>
    </div>
  );
};

export default ExpenseDetailsModal;
