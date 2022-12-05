// Interfaces & configs
import { clientUrl } from "../constants/config";

// React
import { useNavigate } from "react-router-dom";

// MUI
import { IconButton, AppBar, Toolbar, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";

interface IPropsHeader {
  title?: string;
  id?: number;
  screen?: string;
  backButton?: boolean;
  editButton?: boolean;
  saveButton?: boolean;
  cancelButton?: boolean;
  homeButton?: boolean;
  shareButton?: boolean;
  emptyButtonL?: boolean;
  emptyButtonR?: boolean;
  onClick?: () => void;
}

const Header = (props: IPropsHeader) => {
  const title = props.title;
  const id = props.id;
  const screen = props.screen;
  const backButton = props.backButton;
  const editButton = props.editButton;
  const saveButton = props.saveButton;
  const cancelButton = props.cancelButton;
  const homeButton = props.homeButton;
  const shareButton = props.shareButton;
  const emptyButtonL = props.emptyButtonL;
  const emptyButtonR = props.emptyButtonR;

  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        {/* LEFT */}
        {backButton && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => {
              if (screen === "Expenses" || screen === "Profile") navigate("/");
              else navigate(-1);
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
        )}
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
        {emptyButtonL && (
          <IconButton
            className="invisible"
            size="large"
            edge="start"
            color="inherit"
          >
            <ArrowBackIosIcon />
          </IconButton>
        )}

        {/* CENTER */}
        <Typography
          className="text-center"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          <div className="text-2xl">{title}</div>
        </Typography>

        {/* RIGHT */}
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
        {homeButton && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => navigate("/login")}
          >
            <AccountCircleIcon />
          </IconButton>
        )}
        {shareButton && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => navigator.share({ title, url: `${clientUrl}/sharecount-connect/${id}` })}
          >
            <ShareIcon />
          </IconButton>
        )}
        {emptyButtonR && (
          <IconButton
            className="items-left invisible"
            size="large"
            edge="start"
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
