// MUI
import GridViewIcon from "@mui/icons-material/GridView";
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";

import { useNavigate } from "react-router-dom";

interface IPropsMenuHome {
  screen?: string;
  onAddClick?: () => void;
}

const MenuHome = (props: IPropsMenuHome) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex w-full bg-white text-center"
      style={{ height: "120px" }}
    >
      <div className="flex w-full" style={{ height: "100px" }}>
        <div className="flex-1 self-center" onClick={() => navigate("/")}>
          <IconButton size="large">
            <GridViewIcon
              className={`${
                props.screen === "home" ? "text-secondary" : "text-text"
              }`}
            />
          </IconButton>
        </div>
        <div
          className="flex-1 self-center"
          onClick={() => props.onAddClick?.()}
        >
          <IconButton>
            <AddCircleIcon className="text-text" sx={{ fontSize: 55 }} />
          </IconButton>
        </div>
        <div className="flex-1 self-center" onClick={() => navigate("/login")}>
          <IconButton size="large">
            <PersonIcon
              className={`${
                props.screen === "profile" ? "text-secondary" : "text-text"
              }`}
            />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default MenuHome;
