import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

export interface ChildProps {
  sharecount: any;
  onClick: (name: string | undefined) => void;
}

const Sharecount = (props: ChildProps) => {
  const sharecount = props.sharecount;

  return (
    <div>
      <Link to={`/sharecount/${sharecount.id}`}>{sharecount.name}</Link>
      <Link to={`/sharecount-edit/${sharecount.id}`}>
        <Button variant="outlined" size="small">
          Edit
        </Button>
      </Link>
      <Button
        variant="outlined"
        size="small"
        onClick={() => props.onClick(sharecount.id)}
      >
        Delete
      </Button>
    </div>
  );
};

export default Sharecount;
