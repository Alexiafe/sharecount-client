import React, { useEffect, useState } from "react";
import ExpenseItem from "./ExpenseItem";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { IExpense, ISharecount } from "../interfaces/interfaces";
import Loader from "./Loader";
import { serverUrl } from "../constants/config";

const ExpensesList = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [sharecount, setSharecount] = useState<ISharecount | undefined>(
    undefined
  );
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [expenseID, setExpenseID] = useState<number>(0);
  const [expenseName, setExpenseName] = useState<string>("");
  const header = sharecount?.name;

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
    fetch(`${serverUrl}/sharecount/${params.sharecountID}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setSharecount(result);
          setExpenses(result.expenses);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [params.sharecountID]);

  const handleOpen = (expense: IExpense) => {
    setExpenseID(expense.id);
    setExpenseName(expense.name);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const confirmDelete = () => {
    deleteExpense(expenseID);
    setOpen(false);
  };

  const deleteExpense = (expenseID: number) => {
    return fetch(`${serverUrl}/expense/${expenseID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then(() => {
        setExpenses(
          expenses.filter((e: IExpense) => {
            return e.id !== expenseID;
          })
        );
      });
  };

  const openSearchBar = () => {
    console.log("Open search bar");
  };

  const listExpenses = expenses.map((e: IExpense) => (
    <li key={e.id}>
      <ExpenseItem
        expense={e}
        sharecount={sharecount}
        onClick={handleOpen}
      ></ExpenseItem>
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
          backButton="true"
          searchButton="true"
          onClick={openSearchBar}
        ></Header>
        <div>
          <ul className="m-2">{listExpenses}</ul>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {expenseName}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Confirm delete?
              </Typography>
              <div className="flex m-2 justify-center">
                <div>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="mx-2">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => confirmDelete()}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
        <div className="absolute bottom-0 right-0">
          <IconButton
            color="primary"
            onClick={() => navigate(`/sharecount/${params.sharecountID}/expense-add`)}
          >
            <AddCircleOutlineRoundedIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
    );
  }
};

export default ExpensesList;
