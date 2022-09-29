// Interfaces & configs
import { IExpense, ISharecount } from "../interfaces/interfaces";

// React
import { Link } from "react-router-dom";

// MUI
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Other
import moment from "moment";

interface IPropsExpense {
  expense: IExpense;
  sharecount: ISharecount | undefined;
  onClick: (expense: IExpense) => void;
}

const Expense = (props: IPropsExpense) => {
  const expense = props.expense;
  const sharecount = props.sharecount;
  const propsDate = moment(expense.date);
  const date = moment(propsDate).isSame(moment(), "day")
    ? "Today"
    : propsDate.format("DD/MM/YYYY");

  return (
    <div className="flex items-center border-b border-grey-500 pb-1">
      <div className="flex flex-1 items-center">
        <Link
          style={{ display: "inline-block" }}
          className="flex flex-1"
          to={`/sharecount/${expense.sharecount_id}/expense/${expense.id}`}
        >
          <div className="flex">
            <div className="flex-1">
              <p>{expense.name}</p>
              <p className="text-xs">Paid by {expense.owner!.name}</p>
            </div>

            <div className="flex-none text-xs text-right">
              <p>
                {expense.amount_total} {sharecount?.currency}
              </p>
              <p>{date}</p>
              <p>Impact: + TODO {sharecount?.currency}</p>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex-none">
        <IconButton color="primary" onClick={() => props.onClick(expense)}>
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Expense;
