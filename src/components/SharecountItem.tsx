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
    <div className="flex items-center border-b border-grey-500 pb-1">
      <div className="flex-1">
        <div className="flex flex-col">
          <Link to={`/sharecount/${sharecount.id}`}>{sharecount.name}</Link>
          <p className="text-xs">Balance: TODO {sharecount.currency}</p>
        </div>
      </div>
      <div className="flex-none text-center">
        <Link to={`/sharecount-edit/${sharecount.id}`}>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
        </Link>
      </div>
      <div className="flex-none text-center">
        <IconButton color="primary" onClick={() => props.onClick(sharecount)}>
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Sharecount;
