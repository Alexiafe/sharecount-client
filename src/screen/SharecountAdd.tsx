import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import Header from "../components/Header";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

const SharecountAdd = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");

  const [participant, setParticipant] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);

  const addSharecount = (sharecount: any) => {
    return fetch("http://localhost:3000/sharecount2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sharecount),
    }).then((data) => data.json());
  };

  const addParticipants = () => {
    let cloneParticipants = [...participants];
    cloneParticipants.push(participant);
    setParticipants(cloneParticipants);
    setParticipant("");
  };

  const deleteParticipants = (participant: any) => {
    setParticipants(
      participants.filter((p: any) => {
        return p !== participant;
      })
    );
  };

  const save = () => {
    const newSharecount = {
      name: name,
      currency: currency,
      participants: participants,
    };
    addSharecount(newSharecount);
    navigate("/");
  };

  const listParticipants = participants.map((participant: any) => (
    <ListItem
      key={participant}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => deleteParticipants(participant)}
        >
          <ClearIcon />
        </IconButton>
      }
    >
      <ListItemText primary={participant} />
    </ListItem>
  ));

  return (
    <div>
      <Header
        title="New Sharecount"
        cancelButton="true"
        saveButton="true"
        onClick={save}
      ></Header>
      <div className="flex flex-col m-2">
        <div className="m-2">
          <TextField
            fullWidth
            required
            size="small"
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
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
        <div>
          Participants:
          <List>{listParticipants}</List>
          <div className="flex">
            <TextField
              fullWidth
              required
              size="small"
              label="New participant"
              variant="standard"
              value={participant}
              onChange={(e) => {
                setParticipant(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => addParticipants()}
                  >
                    <AddIcon />
                  </IconButton>
                ),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharecountAdd;
