// Interfaces
import {
  IExpenseContext,
  ISharecountContext,
} from "../../interfaces/interfaces";

// Context
import SharecountsContext from "../../context/sharecounts.context";

// Components
import Loader from "../Common/Loader";
import SearchBar from "./SearchBar";
import ExpenseItem from "./ExpenseItem";

// Services
import { getAllExpenses } from "../../services/expense.service";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// Other
import moment from "moment";
import { useInView } from "react-cool-inview";

interface IPropsExpensesList {
  sharecount?: ISharecountContext;
}

const ExpensesList = (props: IPropsExpensesList) => {
  const navigate = useNavigate();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);
  const [expenses, setExpenses] = useState<IExpenseContext[]>(
    props.sharecount?.expenses || []
  );
  const [filter, setFilter] = useState<string>("");

  const { observe } = useInView({
    onEnter: () => {
      handleLoadMore();
    },
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const expensesGroupped: any = expenses.reduce((group: any, expense: any) => {
    const { date } = expense;
    group[date] = group[date] ?? [];
    group[date].push(expense);
    return group;
  }, {});

  const filterExpenses = (filter: string) => {
    setFilter(filter);
  };

  useEffect(() => {
    let currentSharecount = sharecountsContext.find(
      (s) => s.id === props.sharecount?.id!
    );
    if (currentSharecount?.expenses) {
      setExpenses(currentSharecount?.expenses);
      setIsLoaded(true);
    } else {
      if (!expenses.length) {
        getAllExpenses(props.sharecount?.id!).then(
          (response: IExpenseContext[]) => {
            setExpenses(response);
            let newSharecountsContext = [...sharecountsContext];
            let newExpenses = [...expenses, ...response];
            newSharecountsContext.find(
              (s) => s.id === props.sharecount?.id
            )!.expenses = newExpenses;
            setSharecountsContext(newSharecountsContext);
            setIsLoaded(true);
          },
          (error: any) => {
            console.log(error);
            setError(error);
            setIsLoaded(true);
          }
        );
      }
    }
  }, [props.sharecount?.id]);

  const handleLoadMore = async () => {
    console.log("handleLoadMore", page);
    if (isLoaded) {
      const response: IExpenseContext[] = await getAllExpenses(
        props.sharecount?.id!!,
        page
      );
      if (response.length) {
        setExpenses([...expenses, ...response]);
        let newSharecountsContext = [...sharecountsContext];
        let newExpenses = [...expenses, ...response];
        newSharecountsContext.find(
          (s) => s.id === props.sharecount?.id
        )!.expenses = newExpenses;
        setSharecountsContext(newSharecountsContext);
        setPage(page + 1);
      } else {
        setHasMore(false);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div>
        <Loader></Loader>
      </div>
    );
  } else if (error) {
    return <div>Please try again later</div>;
  } else {
    return (
      <div>
        {expenses.length ? (
          <div>
            <SearchBar onClick={filterExpenses}></SearchBar>
            <div className="p-4">
              <ul className="w-full">
                {expenses.map((e: IExpenseContext) => (
                  <li key={e.id} className="py-2 px-5">
                    <ExpenseItem
                      sharecount={props.sharecount}
                      expense={e}
                    ></ExpenseItem>
                  </li>
                ))}
              </ul>
              <div ref={observe}>
                {hasMore ? <Loader key={0}></Loader> : <div></div>}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            <p>No expenses yet.</p>
            <p>Click the " + " button to create one</p>
          </div>
        )}

        <footer className="absolute bottom-0 right-0">
          <div className="pb-5 pr-5">
            <IconButton
              className="pb-5 pr-5"
              size="large"
              color="secondary"
              onClick={() =>
                navigate(`/sharecount/${props.sharecount?.id!}/expense-add`)
              }
            >
              <AddCircleIcon sx={{ fontSize: 65 }} />
            </IconButton>
          </div>
        </footer>
      </div>
    );
  }
};

export default ExpensesList;
