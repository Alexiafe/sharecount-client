// Interfaces
import { IExpenseContext, ISharecountContext } from "../interfaces/interfaces";

// Components
import SearchBar from "./SearchBar";
import ExpenseItem from "../components/ExpenseItem";

// React
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// Other
import moment from "moment";

interface IPropsExpensesList {
  sharecount?: ISharecountContext;
}

const ExpensesList = (props: IPropsExpensesList) => {
  const navigate = useNavigate();
  const params = useParams();

  const [filter, setFilter] = useState<string>("");

  const sharecount = props.sharecount;
  const expenses = props.sharecount?.expenses;

  const expensesGroupped = props.sharecount?.expenses?.reduce(
    (group: any, expense: any) => {
      const { date } = expense;
      group[date] = group[date] ?? [];
      group[date].push(expense);
      return group;
    },
    {}
  );

  const filterExpenses = (filter: string) => {
    setFilter(filter);
  };

  return (
    <div>
      {expenses!.length ? (
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
                            sharecount={sharecount}
                            expense={e}
                          ></ExpenseItem>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
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
              navigate(`/sharecount/${params.sharecountID}/expense-add`)
            }
          >
            <AddCircleIcon sx={{ fontSize: 65 }} />
          </IconButton>
        </div>
      </footer>
    </div>
  );
};

export default ExpensesList;
