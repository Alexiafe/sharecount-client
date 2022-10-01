// React
import { useNavigate } from "react-router-dom";

// MUI
import { IconButton, AppBar, Toolbar, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

interface IPropsHeader {
  title?: string;
  screen?: string;
  backButton?: boolean;
  editButton?: boolean;
  saveButton?: boolean;
  cancelButton?: boolean;
  onClick?: () => void;
}

function Header(props: IPropsHeader) {
  const title = props.title;
  const screen = props.screen;
  const backButton = props.backButton;
  const editButton = props.editButton;
  const saveButton = props.saveButton;
  const cancelButton = props.cancelButton;

  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        {backButton && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              if (screen === "ExpenseList") navigate("/");
              else navigate(-1);
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
        )}
        {cancelButton && <div onClick={() => navigate(-1)}>Cancel</div>}
        <Typography
          className="text-center"
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          <div className="text-xl">{title}</div>
        </Typography>
        {saveButton && <div onClick={() => props.onClick?.()}>Save</div>}
        {editButton && <div onClick={() => props.onClick?.()}>Edit</div>}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
