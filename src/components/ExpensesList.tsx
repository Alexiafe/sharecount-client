// Interfaces
import { IExpenseResponse } from "../interfaces/interfaces";

// Components
import SearchBar from "./SearchBar";
import Loader from "./Loader";

// Services
import { getSharecountService } from "../services/sharecount.service";
import { deleteExpenseService } from "../services/expense.service";

// React
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// Other
import moment from "moment";

interface IExpenseList {
  id: number;
  name: string;
  owner: string;
  amount_total: number;
  date: string;
}

interface ISharecount {
  id: number;
  currency: string;
  user: string;
}

const ExpensesList = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [sharecount, setSharecount] = useState<ISharecount | undefined>(
    undefined
  );
  const [expenses, setExpenses] = useState<IExpenseList[]>([]);
  const [expensesGroupped, setExpensesGroupped] = useState<any[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<IExpenseList>({
    id: 0,
    name: "",
    owner: "",
    amount_total: 0,
    date: "",
  });
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    textAlign: "center",
    p: 4,
  };

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (sharecount) => {
        setIsLoaded(true);
        setSharecount({
          id: sharecount.id,
          currency: sharecount.currency,
          user: sharecount?.userInSharecount[0].participant?.name,
        });
        let parsedExpenses = sharecount.expenses.map((e: IExpenseResponse) => {
          return {
            id: e.id,
            name: e.name,
            owner: e.owner?.name,
            amount_total: e.amount_total,
            date: e.date,
          };
        });
        setExpenses(parsedExpenses);
        setExpensesGroupped(
          parsedExpenses.reduce((group: any, expense: any) => {
            const { date } = expense;
            group[date] = group[date] ?? [];
            group[date].push(expense);
            return group;
          }, {})
        );
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [params.sharecountID]);

  const handleDisplayModal = (expense: IExpenseList) => {
    setSelectedExpense(expense);
    setDisplayModal(true);
  };

  const handleCloseModal = () => setDisplayModal(false);

  const confirmDelete = () => {
    deleteExpense(selectedExpense);
    setDisplayModal(false);
  };

  const deleteExpense = (expense: IExpenseList) => {
    setIsLoaded(false);
    deleteExpenseService(expense.id).then(
      () => {
        setExpensesGroupped(
          expenses
            .filter((e: IExpenseList) => {
              return e.id !== expense.id;
            })
            .reduce((group: any, expense: any) => {
              const { date } = expense;
              group[date] = group[date] ?? [];
              group[date].push(expense);
              return group;
            }, {})
        );
        setIsLoaded(true);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  };

  const filterExpenses = (filter: string) => {
    setFilter(filter);
  };

  let modalContent = (
    <Box sx={style}>
      <Typography variant="h6">{selectedExpense.name}</Typography>
      <Typography sx={{ mt: 2 }}>Confirm delete?</Typography>
      <div className="flex justify-around">
        <div>
          <Button
            variant="outlined"
            sx={{ width: 100, margin: 0 }}
            onClick={() => setDisplayModal(false)}
          >
            Cancel
          </Button>
        </div>
        <div>
          <Button
            variant="outlined"
            sx={{ width: 100, margin: 0 }}
            onClick={() => confirmDelete()}
          >
            Delete
          </Button>
        </div>
      </div>
    </Box>
  );

  if (error) {
    return <div>Please try again later</div>;
  } else if (!isLoaded) {
    return (
      <div>
        <Loader></Loader>
      </div>
    );
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
                    {expensesGroupped[date]?.filter((e: IExpenseList) =>
                      e.name.toLowerCase().includes(filter.toLowerCase())
                    ).length ? (
                      <div className="text-secondary">
                        {moment(date).isSame(moment(), "day")
                          ? "Today"
                          : moment(date).format("DD/MM/YYYY")}
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <div>
                      {expensesGroupped[date]
                        ?.filter((e: IExpenseList) =>
                          e.name.toLowerCase().includes(filter.toLowerCase())
                        )
                        .map((e: IExpenseList) => (
                          <div key={e.id}>
                            <List disablePadding>
                              <ListItem button>
                                <ListItemText
                                  primaryTypographyProps={{
                                    variant: "h6",
                                  }}
                                  primary={e.name}
                                  secondaryTypographyProps={{
                                    variant: "subtitle1",
                                  }}
                                  secondary={
                                    <React.Fragment>
                                      Paid by
                                      <Typography component="span">
                                        {`
                                          ${e.owner}
                                          ${
                                            e.owner === sharecount?.user
                                              ? "(me)"
                                              : ""
                                          }`}
                                      </Typography>
                                    </React.Fragment>
                                  }
                                  onClick={() =>
                                    navigate(
                                      `/sharecount/${sharecount?.id}/expense/${e.id}`
                                    )
                                  }
                                />
                                <ListItemText
                                  style={{ textAlign: "right" }}
                                  primaryTypographyProps={{
                                    variant: "h6",
                                  }}
                                  primary={`${e.amount_total} ${sharecount?.currency}`}
                                  secondaryTypographyProps={{
                                    variant: "subtitle1",
                                  }}
                                  onClick={() =>
                                    navigate(
                                      `/sharecount/${sharecount?.id}/expense/${e.id}`
                                    )
                                  }
                                />
                              </ListItem>
                            </List>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              <Modal open={displayModal} onClose={handleCloseModal}>
                {modalContent}
              </Modal>
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
  }
};

export default ExpensesList;
