import { Link } from "react-router-dom";
import moment from "moment";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Expense = (props: any) => {
  const expense = props.expense;
  const date = moment(expense.date).format("DD/MM/YYYY");

  return (
    <div>
      <div className="flex items-center">
        <div className="flex-1">
          <Link
            to={`/sharecount/${expense.sharecount_id}/expense/${expense.id}`}
          >
            {expense.name}
          </Link>
        </div>
        <div className="flex-1 text-center">{expense.amount_total}</div>
        <div className="flex-1 text-center">{date}</div>
        <div className="flex-none text-center">
          <IconButton color="primary" onClick={() => props.onClick(expense.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Expense;
