import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import Header from "../components/Header";

const SharecountAdd = () => {
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
      <Header title="New Sharecount"></Header>
      <br />
      <div className="flex flex-col">
        <div className=" m-2">
          <TextField
            fullWidth
            required
            size="small"
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className=" m-2">
          <TextField
            fullWidth
            required
            size="small"
            label="Currency"
            variant="outlined"
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="flex m-2">
          <div>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
          <div className="mx-2">
            <Button
              className="mx-2"
              variant="outlined"
              size="small"
              onClick={() => save()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharecountAdd;
