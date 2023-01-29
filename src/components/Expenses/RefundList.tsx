// Interfaces
import {
  IParticipantsContext,
  ISharecountContext,
} from "../../interfaces/interfaces";

// Context
import UserContext from "../../context/user.context";

// Components
import RefundItem from "./RefundItem";
import MyRefundItem from "./MyRefundItem";

// React
import { useEffect, useState, useContext } from "react";

interface IPropsExpensesList {
  sharecount?: ISharecountContext;
}

interface IRefund {
  from: string;
  to: string;
  amount: number;
}

const RefundList = (props: IPropsExpensesList) => {
  const participants =
    props.sharecount && props.sharecount?.participants
      ? props.sharecount.participants
      : [];

  const [refund, setRefund] = useState<any[]>([]);
  const [myRefund, setMyRefund] = useState<any[]>([]);

  const { userContext } = useContext(UserContext);

  useEffect(() => {
    setRefund(minimizeCashFlow(JSON.parse(JSON.stringify(participants)))[0]);
    setMyRefund(minimizeCashFlow(JSON.parse(JSON.stringify(participants)))[1]);
  }, [props]);

  const minimizeCashFlow = (users: IParticipantsContext[]) => {
    // Create a copy of the input array
    var copy = [...users];
    // Sort the copy by ascending balance
    copy.sort((a, b) => a.balance - b.balance);
    // Initialize an empty output array
    var output = [];
    // Iterate through the copy
    for (var i = 0; i < copy.length; i++) {
      // If the current user's balance is less than 0
      if (copy[i].balance < 0) {
        // Iterate through the rest of the copy
        for (var j = i + 1; j < copy.length; j++) {
          // If the next user's balance is greater than 0
          if (copy[j].balance > 0) {
            // Calculate the amount to transfer
            var amount = Math.min(Math.abs(copy[i].balance), copy[j].balance);
            // Push a transfer object to the output array
            output.push({
              from: copy[i].name,
              to: copy[j].name,
              amount: amount,
            });
            // Subtract the transferred amount from the user's balances
            copy[i].balance += amount;
            copy[j].balance -= amount;
            // If the current user's balance is now 0, break out of the inner loop
            if (copy[i].balance === 0) {
              break;
            }
          }
        }
      }
    }

    // Classify output
    let transfers: any = [];
    let myTransfers: any = [];

    output.forEach((e) => {
      if (e.from === userContext || e.to === userContext) {
        myTransfers.push(e);
      } else {
        transfers.push(e);
      }
    });
    return [transfers, myTransfers];
  };

  return (
    <div className="relative p-4" style={{ paddingTop: "48px" }}>
      {myRefund.length === 0 && refund.length === 0 ? (
        <div className="p-4 text-center">
          <p>No transfert yet.</p>
        </div>
      ) : (
        <>
          {myRefund.length ? (
            <ul className="p-4">
              {myRefund.map((r: IRefund, idx: number) => (
                <li className="pt-2" key={idx}>
                  <MyRefundItem
                    sharecount={props.sharecount!}
                    refund={r}
                  ></MyRefundItem>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center">
              <p>No transfert for you yet.</p>
            </div>
          )}
          {refund.length ? (
            <>
              <div className=" p-4 text-secondary">Other</div>
              <ul>
                {refund.map((r: IRefund, idx: number) => (
                  <li key={idx}>
                    <RefundItem
                      sharecount={props.sharecount!}
                      refund={r}
                    ></RefundItem>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default RefundList;
