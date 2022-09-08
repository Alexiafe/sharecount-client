import { Link } from "react-router-dom";
import moment from "moment";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Expense = (props: any) => {
  const expense = props.expense;
  const sharecount = props.sharecount;
  const propsDate = moment(expense.date);
  const date = moment(propsDate).isSame(moment(), "day") ? "Today" : propsDate.format("DD/MM/YYYY");

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
              <p className="text-xs">Paid by x</p>
            </div>

            <div className="flex-none text-xs text-right">
              <p>
                {expense.amount_total} {sharecount.currency}
              </p>
              <p>{date}</p>
              <p>Impact: + x {sharecount.currency}</p>
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
