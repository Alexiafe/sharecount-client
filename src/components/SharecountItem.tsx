// Interfaces & configs
import { ISharecountResponse } from "../interfaces/interfaces";

// React
import { Link } from "react-router-dom";

// MUI
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface IPropsSharecount {
  sharecount: ISharecountResponse;
  onClick: (sharecount: ISharecountResponse) => void;
}

const Sharecount = (props: IPropsSharecount) => {
  const sharecount = props.sharecount;

  return (
    <div className="flex items-center p-2">
      <div className="flex-1">
        <div className="flex flex-col">
          <Link to={`/sharecount/${sharecount.id}`}>
            {sharecount.name}
            <p className="text-xs">Balance: TODO {sharecount.currency}</p>
          </Link>
        </div>
      </div>
      <div className="flex-none">
        <Link to={`/sharecount-edit/${sharecount.id}`}>
          <IconButton size="large" color="primary">
            <EditIcon />
          </IconButton>
        </Link>
      </div>
      <div className="flex-none pl-2">
        <IconButton
          size="large"
          color="primary"
          onClick={() => props.onClick(sharecount)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Sharecount;
