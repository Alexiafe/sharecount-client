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
  const total = props.total;
  const currency = props.currency;
  const id = props.id;
  const expense_id = props.expense_id;
  const screen = props.screen;
  const backButton = props.backButton;
  const saveButton = props.saveButton;
  const cancelButton = props.cancelButton;
  const shareButton = props.shareButton;

  const navigate = useNavigate();

  if (screen === "Home") {
    return (
      <header
        className="flex bg-primary text-white justify-center"
        style={{ height: "150px" }}
      >
        <div className="self-center text-2xl font-bold">{title}</div>
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
              {backButton && (
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
              {cancelButton && (
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
              {shareButton && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  onClick={() =>
                    navigator.share({
                      title,
                      url: `${clientUrl}/sharecount-connect/${id}`,
                    })
                  }
                >
                  <ShareIcon sx={{ fontSize: 27 }} />
                </IconButton>
              )}
            </div>
            <div>
              {saveButton && (
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
            if (screen === "Expenses") navigate(`/sharecount-edit/${id}`);
            else if (screen === "Details")
              navigate(`/sharecount/${id}/expense-edit/${expense_id}`);
          }}
        >
          <div className="self-center text-2xl font-bold">{title}</div>
          <div
            className={`self-center pt-2 ${
              screen === "Expenses" ? "" : "opacity-0"
            }`}
          >
            Total: {total} {currency}
          </div>
        </div>
      </header>
    );
  }
};

export default Header;
