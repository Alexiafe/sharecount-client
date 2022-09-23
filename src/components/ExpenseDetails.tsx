import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { IExpense, IParticipant } from "../interfaces/interfaces";
import { serverUrl } from "../constants/config";

const ExpensesDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [expenseDetails, setExpenseDetails] = useState<IExpense | undefined>(
    undefined
  );
  const [owner, setOwner] = useState<IParticipant | undefined>(undefined);
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const header = expenseDetails?.name;
  const date = moment(expenseDetails?.date).format("DD/MM/YYYY");

  useEffect(() => {
    fetch(`${serverUrl}/expense/${params.expenseID}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setExpenseDetails(result);
          setOwner(result.owner);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
    fetch(`${serverUrl}/sharecount/${params.sharecountID}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setParticipants(result.participants);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [params.expenseID]);

  const edit = () => {
    navigate(
      `/sharecount/${expenseDetails?.sharecount_id}/expense-edit/${params.sharecountID}`
    );
  };

  const listParticipants = participants.map((p: IParticipant) => (
    <li key={p.id}>{p.name}</li>
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
          editButton="true"
          onClick={edit}
        ></Header>
        <div className="items-center m-2">
          <div className="justify-center h-12 flex items-center">
            {expenseDetails?.amount_total}
          </div>
          <div className="flex text-center">
            <div className="flex-1 text-left">Paid by {owner?.name}</div>
            <div className="flex-1 text-right">{date}</div>
          </div>
          <div className=" mt-2">
            For whom:<ul className="mt-2">{listParticipants}</ul>
          </div>
        </div>
      </div>
    );
  }
};

export default ExpensesDetails;
