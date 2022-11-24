// Interfaces & configs
import {
  ISharecountResponse,
  IExpenseResponse,
  IPartakerResponse,
} from "../interfaces/interfaces";

// Components
import Header from "../components/Header";
import Loader from "../components/Loader";

// Services
import { getSharecountService } from "../services/sharecount.service";

// React
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Other
import moment from "moment";
import { List, ListItem, ListItemText } from "@mui/material";

const ExpensesDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [expense, setExpense] = useState<IExpenseResponse | undefined>(
    undefined
  );
  const [partakers, setPartakers] = useState<IPartakerResponse[]>([]);
  const [sharecount, setSharecount] = useState<ISharecountResponse | undefined>(
    undefined
  );
  const header = expense?.name;
  const date = moment(expense?.date).format("DD/MM/YYYY");

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (sharecount) => {
        setIsLoaded(true);
        setSharecount(sharecount);
        let expense = sharecount.expenses.filter(
          (expense: IExpenseResponse) =>
            expense.id === parseInt(params.expenseID!)
        )[0];
        setExpense(expense);
        setPartakers(expense.partakers);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [params.expenseID, params.sharecountID]);

  const edit = () => {
    navigate(
      `/sharecount/${expense?.sharecount_id}/expense-edit/${params.expenseID}`
    );
  };

  const listExpenseParticipants = partakers.map((e: IPartakerResponse) => (
    <li key={e.participant_id}>
      <List disablePadding>
        <ListItem>
          <ListItemText primary={e.participant.name} />
          <ListItemText
            style={{ textAlign: "right" }}
            primary={`${e.amount.toFixed(2)} ${sharecount?.currency}`}
          />
        </ListItem>
      </List>
    </li>
  ));

  if (error) {
    return (
      <div>
        <Header title={header}></Header>
        Please try again later
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        <Header title={header}></Header>
        <Loader></Loader>
      </div>
    );
  } else {
    return (
      <div>
        <Header
          title={header}
          backButton={true}
          editButton={true}
          onClick={edit}
        ></Header>
        <div className="items-center p-3">
          <div className="border-b border-grey-500">
            <div className="justify-center h-20 flex items-center text-xl py-3">
              {expense?.amount_total} {sharecount?.currency}
            </div>
            <div className="flex text-center py-3">
              <div className="flex-1 text-left">
                Paid by {expense?.owner?.name}
              </div>
              <div className="flex-1 text-right">{date}</div>
            </div>
          </div>
          <div className="py-3">
            For whom:<ul>{listExpenseParticipants}</ul>
          </div>
        </div>
      </div>
    );
  }
};

export default ExpensesDetails;
