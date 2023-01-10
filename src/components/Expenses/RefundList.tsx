// Interfaces
import {
  IParticipantsContext,
  ISharecountContext,
} from "../../interfaces/interfaces";

// React
import { useEffect } from "react";

interface IPropsExpensesList {
  sharecount?: ISharecountContext;
}

const RefundList = (props: IPropsExpensesList) => {
  useEffect(() => {
    if (props.sharecount?.participants)
      console.log(determineTransfers(props.sharecount.participants));
  }, [props]);

  function determineTransfers(participants: IParticipantsContext[]) {
    return participants;
  }

  return <div className="p-4">To be done...</div>;
};

export default RefundList;
