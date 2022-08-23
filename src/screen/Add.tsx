import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const Add = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [currency, setCurrency] = useState("");

  const addSharecount = (sharecount: any) => {
    return fetch("http://localhost:3000/sharecount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sharecount),
    }).then((data) => data.json());
  };

  const save = () => {
    const newSharecount = {
      name: title,
      currency: currency,
    };
    addSharecount(newSharecount);
    navigate("/");
  };

  return (
    <div>
      New Sharecount
      <br />
      <div className="flex flex-col">
        <div className=" m-2">
          <TextField
            size="small"
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className=" m-2">
          <TextField
            size="small"
            label="Currency"
            variant="outlined"
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
            }}
          />
        </div>
        <div className=" m-2">
          <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="outlined" size="small" onClick={() => save()}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Add;
