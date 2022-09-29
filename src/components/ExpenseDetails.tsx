// Interfaces & configs
import { IExpense, IExpenseInfo, ISharecount } from "../interfaces/interfaces";
import { serverUrl } from "../constants/config";

// Components
import Header from "../components/Header";
import Loader from "../components/Loader";

// React
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Other
import moment from "moment";

const ExpensesDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [expenseDetails, setExpenseDetails] = useState<IExpense | undefined>(
    undefined
  );
  const [expenseInfo, setExpenseInfo] = useState<IExpenseInfo[]>([]);
  const [sharecount, setSharecount] = useState<ISharecount | undefined>(
    undefined
  );
  const header = expenseDetails?.name;
  const date = moment(expenseDetails?.date).format("DD/MM/YYYY");

  useEffect(() => {
    fetch(`${serverUrl}/expense/${params.expenseID}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setExpenseDetails(result);
          setExpenseInfo(result.expense_info);
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
          setSharecount(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [params.expenseID, params.sharecountID]);

  const edit = () => {
    navigate(
      `/sharecount/${expenseDetails?.sharecount_id}/expense-edit/${params.expenseID}`
    );
  };

  const listExpenseParticipants = expenseInfo.map((e: IExpenseInfo) => (
    <li key={e.id}>
      <div className="flex border-b border-grey-500 pb-1">
        <div className="flex-1">{e.participant.name}</div>
        <div className="flex-none">
          {e.amount} {sharecount?.currency}
        </div>
      </div>
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
          backButton={true}
          editButton={true}
          onClick={edit}
        ></Header>
        <div className="items-center m-2">
          <div className="border-b border-grey-500 pb-1">
            <div className="justify-center h-12 flex items-center">
              {expenseDetails?.amount_total} {sharecount?.currency}
            </div>
            <div className="flex text-center">
              <div className="flex-1 text-left">
                Paid by {expenseDetails?.owner?.name}
              </div>
              <div className="flex-1 text-right">{date}</div>
            </div>
          </div>
          <div className=" mt-2">
            For whom:<ul className="mt-2">{listExpenseParticipants}</ul>
          </div>
        </div>
      </div>
    );
  }
};

export default ExpensesDetails;
