// Interfaces & configs
import { clientUrl } from "../../constants/config";
import { IParticipantsContext } from "../../interfaces/interfaces";

// Context
import UserContext from "../../context/user.context";

// React
import { useContext } from "react";

// MUI
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ShareIcon from "@mui/icons-material/Share";

interface IPropsHeader {
  title?: string;
  total?: number;
  currency?: string;
  id?: number;
  participants?: IParticipantsContext[];
  expense_id?: number;
  owner?: string;
  amount_total?: number;
  date?: string;
  screen?: string;
  backButton?: boolean;
  shareButton?: boolean;
  onTitleClick?: () => void;
  onReturn?: () => void;
}

const Header = (props: IPropsHeader) => {
  const title = props.title;

  const { userContext } = useContext(UserContext);

  const buttons = (
    <div className="flex justify-between">
      <div className="flex">
        <div>
          {props.backButton && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={() => props.onReturn?.()}
            >
              <ArrowBackIosIcon sx={{ fontSize: 27 }} />
            </IconButton>
          )}
        </div>
      </div>
      <div className="flex">
        <div>
          {props.shareButton && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={() =>
                navigator.share({
                  title,
                  url: `${clientUrl}/sharecount-connect/${props.id}`,
                })
              }
            >
              <ShareIcon sx={{ fontSize: 27 }} />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );

  const expensesText = (
    <>
      <div className="flex flex-col" onClick={() => props.onTitleClick?.()}>
        <div className="self-center text-2xl font-bold">{props.title}</div>
        <div className="self-center pt-1 italic font-semibold">
          Total: {props.total} {props.currency}
        </div>
        <div className="self-center pt-3 text-sm">
          {props.participants
            ?.map((p) => p.name)
            .sort()
            .join(", ")}
        </div>
      </div>
    </>
  );

  const expenseDetailsText = (
    <>
      <div className="flex flex-col" onClick={() => props.onTitleClick?.()}>
        <div className="self-center text-2xl font-bold">{props.title}</div>
        <div className="self-center pt-1 italic font-semibold">
          {props.amount_total} {props.currency}
        </div>
        <div className="flex text-center pt-3 text-sm">
          <div className="flex-1 text-left">
            Paid by {props.owner}
            {props.owner === userContext ? " (me) " : ""}
          </div>
          <div className="flex-1 text-right">{props.date}</div>
        </div>
      </div>
    </>
  );

  if (props.screen === "Expenses") {
    return (
      <header
        className="flex fixed top-0 bg-primary text-white justify-center w-full flex-col p-4"
        style={{
          height: "170px",
          zIndex: 100,
          borderRadius: "0 0 15px 15px",
        }}
      >
        {buttons}
        {expensesText}
      </header>
    );
  } else if (props.screen === "Details") {
    return (
      <header
        className="flex fixed top-0 bg-primary text-white justify-center w-full flex-col p-4"
        style={{ height: "170px", zIndex: 100, borderRadius: "0 0 15px 15px" }}
      >
        {buttons}
        {expenseDetailsText}
      </header>
    );
  } else {
    return (
      <header
        className="flex fixed top-0 bg-primary text-white justify-center w-full"
        style={{ height: "170px", zIndex: 100 }}
      >
        {buttons}
        <div className="self-center text-2xl font-bold">{props.title}</div>
      </header>
    );
  }
};

export default Header;
