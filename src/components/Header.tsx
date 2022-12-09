// Interfaces & configs
import { clientUrl } from "../constants/config";

// React
import { useNavigate } from "react-router-dom";

// MUI
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";

interface IPropsHeader {
  title?: string;
  total?: number;
  currency?: string;
  id?: number;
  screen?: string;
  backButton?: boolean;
  editButton?: boolean;
  saveButton?: boolean;
  cancelButton?: boolean;
  shareButton?: boolean;
  onClick?: () => void;
}

const Header = (props: IPropsHeader) => {
  const title = props.title;
  const total = props.total;
  const currency = props.currency;
  const id = props.id;
  const screen = props.screen;
  const backButton = props.backButton;
  const editButton = props.editButton;
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
        className="flex flex-col bg-primary text-white justify-center p-3"
        style={{ height: "150px", borderRadius: "0 0 30px 30px" }}
      >
        <div className="flex justify-between">
          <div className="flex">
            <div>
              {backButton && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  onClick={() => {
                    if (screen === "Expenses" || screen === "Profile")
                      navigate("/");
                    else navigate(-1);
                  }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
              )}
            </div>
            <div>
              {cancelButton && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  onClick={() => navigate(-1)}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          </div>
          <div className="flex">
            <div>
              {editButton && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  onClick={() => props.onClick?.()}
                >
                  <EditIcon />
                </IconButton>
              )}
            </div>
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
                  <ShareIcon />
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
                  <DoneIcon />
                </IconButton>
              )}
            </div>
          </div>
        </div>
        <div className="self-center text-2xl font-bold">{title}</div>
        <div
          className={`self-center pt-2 ${
            screen === "Expenses" ? "" : "opacity-0"
          }`}
        >
          Total: {total} {currency}
        </div>
      </header>
    );
  }
};

export default Header;
