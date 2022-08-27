import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export interface ChildProps {
  sharecount: any;
  onClick: (name: string | undefined) => void;
}

const Sharecount = (props: ChildProps) => {
  const sharecount = props.sharecount;

  return (
    <div className="flex items-center">
      <div className="flex-1 text-center">
        <Link to={`/sharecount/${sharecount.id}`}>{sharecount.name}</Link>
      </div>
      <div className="flex-1 text-center">
        <Link to={`/sharecount-edit/${sharecount.id}`}>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
        </Link>
      </div>
      <div className="flex-1 text-center">
        <IconButton
          color="primary"
          onClick={() => props.onClick(sharecount.id)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Sharecount;
