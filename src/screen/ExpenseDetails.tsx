// Interfaces & configs
import {
  ISharecountContext,
  IExpenseContext,
  IPartakersContext,
} from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import NotLoggedIn from "../components/Common/NotLoggedIn";

// Services
import { getSharecountService } from "../services/sharecount.service";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import { List, ListItem, ListItemText } from "@mui/material";

// Other
import moment from "moment";

const ExpensesDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [sharecount, setSharecount] = useState<ISharecountContext>();
  const [expense, setExpense] = useState<IExpenseContext>();
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;

  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);
  const header = expense?.name;
  const date = moment(expense?.date).format("DD/MM/YYYY");

  useEffect(() => {
    let currentSharecount = sharecountsContext.find(
      (s) => s.id === parseInt(params.sharecountID!)
    );
    let currentExpense = currentSharecount?.expenses?.find(
      (e) => e.id === parseInt(params.expenseID!)
    );
    if (currentExpense) {
      setSharecount(currentSharecount);
      setExpense(currentExpense);
      setIsLoaded(true);
    } else {
      getSharecountService(parseInt(params.sharecountID!)).then(
        (sharecount: ISharecountContext) => {
          // setSharecountsContext([...filteredSharecounts, parsedSharecount]); // TODO
          setSharecount(sharecount);
          setExpense(
            sharecount?.expenses?.find(
              (e) => e.id === parseInt(params.expenseID!)
            )
          );
          setIsLoaded(true);
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );
    }
  }, [params.expenseID, params.sharecountID]);

  const edit = () => {
    navigate(
      `/sharecount/${params.sharecountID}/expense-edit/${params.expenseID}`
    );
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
        <Header title={header}></Header>
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
          id={Number(params.sharecountID)}
          expense_id={Number(params.expenseID)}
          backButton={true}
          screen="Details"
          onReturn={() => navigate(`/sharecount/${params.sharecountID}`)}
          onClick={edit}
        ></Header>
        <div className="items-center p-4">
          <div className="border-b border-grey-500 text-text">
            <div className="justify-center h-20 flex items-center text-xl font-medium py-3">
              {expense?.amount_total} {sharecount?.currency}
            </div>
            <div className="flex text-center py-3">
              <div className="flex-1 text-left">
                Paid by {expense?.owner?.name}
              </div>
              <div className="flex-1 text-right">{date}</div>
            </div>
          </div>
          <div className="py-3 text-text">
            For whom:<ul>{listExpenseParticipants}</ul>
          </div>
        </div>
      </div>
    );
  }
};

export default ExpensesDetails;
