import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import Header from "../components/Header";

const ExpensesDetails = () => {
  const params = useParams();

  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState<any>(null);

  const header = expenseDetails?.name;
  const date = moment(expenseDetails?.date).format("DD/MM/YYYY");

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
        <Header title={header} backButton="true" editButton="true"></Header>
        <div className="flex items-center m-2">
          <div className="flex-1 text-center">
            {expenseDetails?.amount_total}
          </div>
          <div className="flex-1 text-center">{date}</div>
        </div>
      </div>
    );
  }
};

export default ExpensesDetails;
