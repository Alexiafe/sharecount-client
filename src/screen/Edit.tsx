import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";

const Edit = () => {
  const navigate = useNavigate();
  let params = useParams();
  return (
    <div>
      Edit {params.id}
      <br />
      <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
        Back
      </Button>
    </div>
  );
};

export default Edit;
