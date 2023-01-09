// Interfaces
import {
  IExpenseContext,
  ISharecountContext,
} from "../../interfaces/interfaces";

// Context
import SharecountsContext from "../../context/sharecounts.context";
import ExpensePositionContext from "../../context/expenseposition.context";

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
  const { expenseIdContext, expensePositionContext } = useContext(
    ExpensePositionContext
  );
  const [filter, setFilter] = useState<string>("");

  const { observe } = useInView({
    onEnter: () => {
      handleLoadMore();
    },
  });

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
            if (
              newSharecountsContext.find((s) => s.id === props.sharecount?.id)
            ) {
              newSharecountsContext.find(
                (s) => s.id === props.sharecount?.id
              )!.expenses = newExpenses;
              setSharecountsContext(newSharecountsContext);
            }
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
    scrollDown();
  }, [props.sharecount?.id]);

  const scrollDown = () => {
    setTimeout(function () {
      const element = document.getElementById(expenseIdContext);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 500);
  };

  const handleLoadMore = async () => {
    let page = Math.round(expenses.length / 10);
    if (isLoaded) {
      const response: IExpenseContext[] = await getAllExpenses(
        props.sharecount?.id!!,
        page
      );
      if (response.length) {
        let alreadyExist = expenses.find(
          (expense) => expense.id === response[0].id
        );
        if (!alreadyExist) {
          setExpenses([...expenses, ...response]);
          let newSharecountsContext = [...sharecountsContext];
          let newExpenses = [...expenses, ...response];
          if (
            newSharecountsContext.find((s) => s.id === props.sharecount?.id)
          ) {
            newSharecountsContext.find(
              (s) => s.id === props.sharecount?.id
            )!.expenses = newExpenses;
            setSharecountsContext(newSharecountsContext);
          }
        }
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
              {Object.keys(expensesGroupped)
                .sort()
                .reverse()
                .map((date: any) => (
                  <div key={date}>
                    {expensesGroupped[date]?.filter((e: IExpenseContext) =>
                      e.name.toLowerCase().includes(filter.toLowerCase())
                    ).length ? (
                      <div className="text-secondary">
                        {moment(date).isSame(moment(), "day")
                          ? "Today"
                          : moment(date).isSame(
                              moment().subtract(1, "days"),
                              "day"
                            )
                          ? "Yesterday"
                          : moment(date).format("DD/MM/YYYY")}
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <div>
                      {expensesGroupped[date]
                        ?.filter((e: IExpenseContext) =>
                          e.name.toLowerCase().includes(filter.toLowerCase())
                        )
                        .map((e: IExpenseContext) => (
                          <div key={e.id}>
                            <ExpenseItem
                              sharecount={props.sharecount}
                              expense={e}
                            ></ExpenseItem>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
            <div ref={observe}>
              {hasMore ? <Loader key={0}></Loader> : <div></div>}
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
