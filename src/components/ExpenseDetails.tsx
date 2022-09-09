import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { IExpense } from "../interfaces/interfaces";

const ExpensesDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [expenseDetails, setExpenseDetails] = useState<IExpense | undefined>(
    undefined
  );
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

  const edit = () => {
    navigate(
      `/sharecount/${expenseDetails?.sharecount_id}/expense-edit/${params.id}`
    );
  };

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
          editButton="true"
          onClick={edit}
        ></Header>
        <div className="items-center m-2">
          <div className="justify-center h-12 flex items-center">
            {expenseDetails?.amount_total}
          </div>
          <div className="flex text-center">
            <div className="flex-1 text-left">Paid by x</div>
            <div className="flex-1 text-right">{date}</div>
          </div>
        </div>
      </div>
    );
  }
};

export default ExpensesDetails;
