// Interfaces & configs
import { clientUrl } from "../../constants/config";

// React
import { useNavigate } from "react-router-dom";

// MUI
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ShareIcon from "@mui/icons-material/Share";

interface IPropsHeader {
  title?: string;
  total?: number;
  currency?: string;
  id?: number;
  expense_id?: number;
  screen?: string;
  backButton?: boolean;
  saveButton?: boolean;
  cancelButton?: boolean;
  shareButton?: boolean;
  onClick?: () => void;
  onReturn?: () => void;
}

const Header = (props: IPropsHeader) => {
  const title = props.title;
  const navigate = useNavigate();

  if (props.screen === "Home") {
    return (
      <header
        className="flex fixed top-0 bg-primary text-white justify-center w-full"
        style={{
          height: "150px",
          zIndex: 100,
        }}
      >
        <div className="self-center text-2xl font-bold">{props.title}</div>
      </header>
    );
  } else {
    return (
      <header
        className="flex flex-col bg-primary text-white justify-center p-4"
        style={{ height: "150px", borderRadius: "0 0 15px 15px" }}
      >
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
            <div>
              {props.cancelButton && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  onClick={() => props.onReturn?.()}
                >
                  <CloseIcon sx={{ fontSize: 27 }} />
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
            <div>
              {props.saveButton && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  onClick={() => props.onClick?.()}
                >
                  <DoneIcon sx={{ fontSize: 27 }} />
                </IconButton>
              )}
            </div>
          </div>
        </div>
        <div
          className="flex flex-col"
          onClick={() => {
            if (props.screen === "Expenses")
              navigate(`/sharecount-edit/${props.id}`);
            else if (props.screen === "Details")
              navigate(
                `/sharecount/${props.id}/expense-edit/${props.expense_id}`
              );
          }}
        >
          <div className="self-center text-2xl font-bold">{props.title}</div>
          <div
            className={`self-center pt-2 ${
              props.screen === "Expenses" ? "" : "opacity-0"
            }`}
          >
            Total: {props.total} {props.currency}
          </div>
        </div>
      </header>
    );
  }
};

export default Header;
