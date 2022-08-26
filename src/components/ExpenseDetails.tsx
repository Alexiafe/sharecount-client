import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

const ExpensesDetails = () => {
  const navigate = useNavigate();
  let params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState<any>(null);

  let date = moment(expenseDetails?.date).format("DD/MM/YYYY");

  useEffect(() => {
    fetch(`http://localhost:3000/expense/${params.id}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setExpenseDetails(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [params.id]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <p>{expenseDetails?.amount_total}</p>
        <p>{date}</p>
        <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    );
  }
};

export default ExpensesDetails;
