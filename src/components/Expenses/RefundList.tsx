// Interfaces
import {
  IParticipantsContext,
  ISharecountContext,
} from "../../interfaces/interfaces";

// Components
import RefundItem from "./RefundItem";
import MyRefundItem from "./MyRefundItem";

// React
import { useEffect, useState } from "react";

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

  useEffect(() => {
    setRefund(determineTransfers(JSON.parse(JSON.stringify(participants)))[0]);
    setMyRefund(
      determineTransfers(JSON.parse(JSON.stringify(participants)))[1]
    );
  }, [props]);

  const determineTransfers = (participants: IParticipantsContext[]) => {
    // Initialize an empty list of transfers
    let transfers = [];
    let myTransfers = [];

    let totalBalance = 0;
    // calculate the total balance
    for (let i = 0; i < participants.length; i++) {
      totalBalance += participants[i].balance;
    }

    // Average balance is the total balance divided by number of participants
    let averageBalance = totalBalance / participants.length;

    // Iterate through the participants2
    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];

      if (participant.balance > averageBalance) {
        let transferAmount = participant.balance - averageBalance;
        let fromParticipant;
        for (let j = 0; j < participants.length; j++) {
          if (participants[j].balance < averageBalance && i !== j) {
            fromParticipant = participants[j];
            break;
          }
        }
        if (fromParticipant) {
          if (
            fromParticipant.name === props.sharecount!.user ||
            participant.name === props.sharecount!.user
          ) {
            myTransfers.push({
              from: fromParticipant.name,
              to: participant.name,
              amount: transferAmount,
            });
          } else {
            transfers.push({
              from: fromParticipant.name,
              to: participant.name,
              amount: transferAmount,
            });
          }
          participant.balance -= transferAmount;
          fromParticipant.balance += transferAmount;
        }
      }
    }
    return [transfers, myTransfers];
  };

  return (
    <div className="p-4">
      {myRefund.length ? (
        <ul className="pb-4">
          {myRefund.map((r: IRefund, idx: number) => (
            <li key={idx}>
              <MyRefundItem
                sharecount={props.sharecount!}
                refund={r}
              ></MyRefundItem>
            </li>
          ))}
        </ul>
      ) : (
        <div></div>
      )}
      {refund.length ? (
        <>
          <div className="text-secondary">Other</div>
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
        <div></div>
      )}
    </div>
  );
};

export default RefundList;
