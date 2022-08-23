import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";

const Details = (props: any) => {
  const navigate = useNavigate();
  let params = useParams();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/expenses")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          console.log(result);
          setExpenses(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const listExpenses = expenses.map((expense: any) => (
    <li key={expense.id}>
      <p>{expense.name}</p>
      <p>{expense.amount_total}</p>
    </li>
  ));

  return (
    <div>
      sharecount details
      {params.id}
      <br />
      <div>
        <ul>{listExpenses}</ul>
      </div>
      <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
        Back
      </Button>
    </div>
  );
};

export default Details;
