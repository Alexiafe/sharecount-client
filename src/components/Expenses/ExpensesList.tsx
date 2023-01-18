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
import ExpenseDetailsModal from "./ExpenseDetailsModal";
import ExpenseAddModal from "./ExpenseAddModal";

// Services
import { getAllExpensesService } from "../../services/expense.service";
import { getFilteredExpensesService } from "../../services/expense.service";

// React
import { useContext, useEffect, useState } from "react";

// MUI
import { IconButton, Dialog } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// Other
import moment from "moment";
import { useInView } from "react-cool-inview";

interface IPropsExpensesList {
  sharecount?: ISharecountContext;
  onAddExpense?: (expense: IExpenseContext) => void;
  onEditExpense?: (expense: IExpenseContext) => void;
  onDeleteExpense?: (expense: IExpenseContext) => void;
}

const ExpensesList = (props: IPropsExpensesList) => {
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);
  const [expenses, setExpenses] = useState<IExpenseContext[]>(
    props.sharecount?.expenses || []
  );
  const [hasMore, setHasMore] = useState(true);
  const [displayModalExpenseDetails, setDisplayModalExpenseDetails] =
    useState<boolean>(false);
  const [displayModalExpenseAdd, setDisplayModalExpenseAdd] =
    useState<boolean>(false);

  const [currentExpense, setCurrentExpense] = useState<IExpenseContext>();

  const { observe } = useInView({
    onEnter: () => {
      handleLoadMore();
    },
  });

  const expensesGroupped: any = expenses.reduce((group: any, expense: any) => {
    const { date } = expense;
    group[date] = group[date] ?? [];
    group[date].push(expense);
    return group;
  }, {});

  useEffect(() => {
    let currentSharecount = sharecountsContext.find(
      (s) => s.id === props.sharecount?.id!
    );
    if (currentSharecount) {
      if (currentSharecount.expenses) {
        setExpenses(currentSharecount.expenses);
        setIsLoaded(true);
      } else {
        getAllExpensesService(props.sharecount?.id!).then(
          (expensesResponse: IExpenseContext[]) => {
            setExpenses(expensesResponse);
            currentSharecount!.expenses = expensesResponse;
            setIsLoaded(true);
          },
          (error) => {
            console.log(error);
            setError(error);
            setIsLoaded(true);
          }
        );
      }
    } else {
      getAllExpensesService(props.sharecount?.id!).then(
        (expensesResponse: IExpenseContext[]) => {
          setExpenses(expensesResponse);
          setIsLoaded(true);
        },
        (error) => {
          console.log(error);
          setError(error);
          setIsLoaded(true);
        }
      );
    }
  }, [props]);

  const handleCloseModalExpenseDetails = () =>
    setDisplayModalExpenseDetails(false);

  const handleCloseModalExpenseAdd = () => setDisplayModalExpenseAdd(false);

  const handleAddExpense = (expense: IExpenseContext) => {
    props.onAddExpense?.(expense);
    let newExpenses = [expense, ...expenses];
    // Update expenses list
    setExpenses(newExpenses);
    // Update context
    sharecountsContext.find((s) => s.id === props.sharecount?.id!)!.expenses =
      newExpenses;
    setDisplayModalExpenseAdd(false);
  };

  const handleEditExpense = (expense: IExpenseContext) => {
    props.onEditExpense?.(expense);
    // Update expenses list
    expenses.find((e) => e.id === expense.id)!.name = expense.name;
    expenses.find((e) => e.id === expense.id)!.amount_total =
      expense.amount_total;
    expenses.find((e) => e.id === expense.id)!.owner = expense.owner;
    expenses.find((e) => e.id === expense.id)!.partakers = expense.partakers;
    // Update context
    sharecountsContext.find((s) => s.id === props.sharecount?.id!)!.expenses =
      expenses;

    setDisplayModalExpenseAdd(false);
  };

  const handleDeleteExpense = (expense: IExpenseContext) => {
    props.onDeleteExpense?.(expense);
    let newExpenses = expenses.filter((e) => e.id !== expense.id);
    // Update expenses list
    setExpenses(newExpenses);
    // Update context
    sharecountsContext.find((s) => s.id === props.sharecount?.id!)!.expenses =
      newExpenses;
    setDisplayModalExpenseAdd(false);
  };

  const manageFilterChange = (filter: string) => {
    if (filter.length > 0) {
      setHasMore(false);
      getFilteredExpensesService(props.sharecount?.id!, filter).then(
        (expensesResponse: IExpenseContext[]) => {
          setExpenses(expensesResponse);
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      setHasMore(true);
      let currentSharecount = sharecountsContext.find(
        (s) => s.id === props.sharecount?.id!
      );
      setExpenses(currentSharecount?.expenses || []);
    }
  };

  const handleLoadMore = async () => {
    if (expenses.length < 10) {
      setHasMore(false);
      return;
    }
    let page = Math.round(expenses.length / 10);
    if (isLoaded) {
      const expensesResponse: IExpenseContext[] = await getAllExpensesService(
        props.sharecount?.id!!,
        page
      );
      if (expensesResponse.length) {
        setHasMore(true);
        let currentExpense = expenses.find(
          (expense) => expense.id === expensesResponse[0].id
        );
        if (!currentExpense) {
          let newExpenses = [...expenses, ...expensesResponse];
          setExpenses(newExpenses);

          let currentSharecount = sharecountsContext.find(
            (s) => s.id === props.sharecount?.id!
          );
          if (currentSharecount) {
            currentSharecount.expenses = newExpenses;
          }
        }
      } else setHasMore(false);
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
      <div className="relative" style={{ paddingTop: "48px" }}>
        <SearchBar onChange={manageFilterChange}></SearchBar>
        {expenses.length ? (
          <div>
            <div className="p-4">
              {Object.keys(expensesGroupped)
                .sort()
                .reverse()
                .map((date: any) => (
                  <div key={date}>
                    {expensesGroupped[date]?.length ? (
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
                      <></>
                    )}
                    <div>
                      {expensesGroupped[date].map((e: IExpenseContext) => (
                        <div
                          key={e.id}
                          onClick={() => {
                            setDisplayModalExpenseDetails(true);
                            setCurrentExpense(e);
                          }}
                        >
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
            {hasMore ? (
              <div ref={observe}>
                <Loader key={0}></Loader>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p>No expenses yet.</p>
            <p>Click the " + " button to create one</p>
          </div>
        )}
        <footer className="fixed bottom-0 right-0">
          <div className="pb-5 pr-5">
            <IconButton
              className="pb-5 pr-5"
              size="large"
              color="secondary"
              onClick={() => setDisplayModalExpenseAdd(true)}
            >
              <AddCircleIcon sx={{ fontSize: 65 }} />
            </IconButton>
          </div>
        </footer>
        <Dialog
          fullScreen
          open={displayModalExpenseDetails}
          onClose={handleCloseModalExpenseDetails}
        >
          <ExpenseDetailsModal
            sharecount={props.sharecount}
            expense={currentExpense}
            onReturn={handleCloseModalExpenseDetails}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          ></ExpenseDetailsModal>
        </Dialog>
        <Dialog
          fullScreen
          open={displayModalExpenseAdd}
          onClose={handleCloseModalExpenseAdd}
        >
          <ExpenseAddModal
            sharecount={props.sharecount}
            expense={currentExpense}
            onReturn={handleCloseModalExpenseAdd}
            onAddExpense={handleAddExpense}
          ></ExpenseAddModal>
        </Dialog>
      </div>
    );
  }
};

export default ExpensesList;
