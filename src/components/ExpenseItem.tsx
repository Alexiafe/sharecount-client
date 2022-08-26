import { Link } from "react-router-dom";
import moment from "moment";
import Button from "@mui/material/Button";

const Expense = (props: any) => {
  const expense = props.expense;
  let date = moment(expense.date).format("DD/MM/YYYY");

  return (
    <div>
      <p>
        <Link to={`/sharecount/${expense.sharecount_id}/expense/${expense.id}`}>
          {expense.name}
        </Link>
      </p>
      <p>{expense.amount_total}</p>
      <p>{date}</p>
      <Button
        variant="outlined"
        size="small"
        onClick={() => props.onClick(expense.id)}
      >
        Delete
      </Button>
    </div>
  );
};

export default Expense;
