import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

const SharecountEdit = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sharecount, setSharecount] = useState<any>(null);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");

  const [participant, setParticipant] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);

  const title = `Edit ${sharecount?.name}`;

  useEffect(() => {
    fetch(`http://localhost:3000/sharecount/${params.id}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setSharecount(result);
          setName(result.name);
          setCurrency(result.currency);
          setParticipants(result.participants.map((p: any) => p.name));
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [params.id]);

  const editSharecount = (sharecount: any) => {
    return fetch(`http://localhost:3000/sharecount2/${params.id}`, {
      method: "PUT",
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
    editSharecount(newSharecount);
    navigate(-1);
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

  if (error) {
    return (
      <div>
        <Header title={title} backButton="true"></Header>
        Error: {error.message}
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        <Header title={title}></Header>
        Loading...
      </div>
    );
  } else {
    return (
      <div>
        <Header
          title={title}
          cancelButton="true"
          saveButton="true"
          onClick={save}
        ></Header>
        {participants}
        <div className="flex flex-col m-2">
          <div className="m-2">
            <TextField
              required
              fullWidth
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
          <div className="m-2">
            <TextField
              required
              fullWidth
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
  }
};

export default SharecountEdit;
