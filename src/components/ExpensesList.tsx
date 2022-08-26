import React, { useEffect, useState } from "react";
import ExpenseItem from "./ExpenseItem";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";

const ExpensesList = () => {
  const navigate = useNavigate();
  let params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/expenses/${params.id}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setExpenses(result);
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
        setExpenses(
          expenses.filter((expense: any) => {
            return expense.id !== expenseID;
          })
        );
      });
  };

  const listExpenses = expenses.map((expense: any) => (
    <li key={expense.id}>
      <ExpenseItem expense={expense} onClick={deleteExpense}></ExpenseItem>
    </li>
  ));

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <div>
          <ul>{listExpenses}</ul>
        </div>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/sharecount/${params.id}/expense-add`)}
        >
          New Expense
        </Button>
        <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    );
  }
};

export default ExpensesList;
