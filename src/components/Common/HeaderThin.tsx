// MUI
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

interface IPropsHeader {
  title?: string;
  saveButton?: boolean;
  cancelButton?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

const Header = (props: IPropsHeader) => {
  const title = props.title;

  const buttons = (
    <div className="flex justify-between">
      <div>
        {props.cancelButton && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => props.onCancel?.()}
          >
            <CloseIcon sx={{ fontSize: 27 }} />
          </IconButton>
        )}
      </div>
      <div className="self-center text-2xl font-bold">{props.title}</div>
      <div>
        {props.saveButton && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => props.onSave?.()}
          >
            <DoneIcon sx={{ fontSize: 27 }} />
          </IconButton>
        )}
      </div>
    </div>
  );

  return (
    <header
      className="flex flex-col bg-primary text-white justify-center p-4"
      style={{ height: "90px", borderRadius: "0 0 15px 15px" }}
    >
      {buttons}
    </header>
  );
};

export default Header;
