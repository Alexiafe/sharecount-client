import React, { useEffect, useState } from "react";
import ExpenseItem from "./ExpenseItem";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { IconButton } from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

const ExpensesList = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sharecount, setSharecount] = useState<any>(null);

  const header = sharecount?.name;

  useEffect(() => {
    fetch(`http://localhost:3000/sharecount/${params.id}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setSharecount(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [params.id]);

  const deleteExpense = (expenseID: any) => {
    return fetch(`http://localhost:3000/expense/${expenseID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then(() => {
        setSharecount(
          sharecount?.expenses.filter((expense: any) => {
            return expense.id !== expenseID;
          })
        );
      });
  };

  const listExpenses = sharecount?.expenses.map((expense: any) => (
    <li key={expense.id}>
      <ExpenseItem expense={expense} onClick={deleteExpense}></ExpenseItem>
    </li>
  ));

  if (error) {
    return (
      <div>
        <Header title={header}></Header>
        Error: {error.message}
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        <Header title={header}></Header>
        Loading...
      </div>
    );
  } else {
    return (
      <div>
        <Header title={header} backButton="true"></Header>
        <div>
          <ul className="m-2">{listExpenses}</ul>
        </div>
        <div className="m-2">
          <IconButton
            color="primary"
            onClick={() => navigate(`/sharecount/${params.id}/expense-add`)}
          >
            <AddCircleOutlineRoundedIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
    );
  }
};

export default ExpensesList;
