// Interfaces & configs
import {
  ISharecountContext,
  IExpenseContext,
  IPartakersContext,
} from "../../interfaces/interfaces";

// Components
import Header from "../Common/Header";

// React
import { useNavigate } from "react-router-dom";

// MUI
import { List, ListItem, ListItemText } from "@mui/material";

// Other
import moment from "moment";

interface IPropsExpenseDetailsModal {
  sharecount?: ISharecountContext;
  expense?: IExpenseContext;
  onReturn?: () => void;
}

const ExpenseDetailsModal = (props: IPropsExpenseDetailsModal) => {
  const navigate = useNavigate();
  const expense = props.expense;
  const sharecount = props.sharecount;
  const header = expense?.name;
  const date = moment(expense?.date).format("DD/MM/YYYY");

  const edit = () => {
    navigate(`/sharecount/${sharecount!.id}/expense-edit/${expense!.id}`);
  };

  const listExpenseParticipants = expense?.partakers.map(
    (p: IPartakersContext) => (
      <li key={p.id}>
        <List disablePadding>
          <ListItem>
            <ListItemText primary={p.name} />
            <ListItemText
              style={{ textAlign: "right" }}
              primary={`${p.amount.toFixed(2)} ${sharecount?.currency}`}
            />
          </ListItem>
        </List>
      </li>
    )
  );

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
        user={sharecount?.user}
        backButton={true}
        screen="Details"
        onReturn={() => props.onReturn?.()}
        onClick={edit}
      ></Header>
      <div className=" relative items-center p-4">
        <div className="text-text">
          For {expense?.partakers.length} participants:
          <ul>{listExpenseParticipants}</ul>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailsModal;
