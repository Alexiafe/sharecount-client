// Components
import Header from "../components/Header";

// Services
import { addSharecountService } from "../services/sharecount.service";

// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

const SharecountAdd = () => {
  const navigate = useNavigate();
  const [sharecountName, setSharecountName] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [participantTextField, setParticipantTextField] = useState<string>("");
  const [participantsNameArray, setParticipantsNameArray] = useState<string[]>(
    []
  );

  const addParticipants = () => {
    let newParticipants = [...participantsNameArray];
    newParticipants.push(participantTextField);
    setParticipantsNameArray(newParticipants);
    setParticipantTextField("");
  };

  const deleteParticipant = (participant: string) => {
    setParticipantsNameArray(
      participantsNameArray.filter((p: string) => {
        return p !== participant;
      })
    );
  };

  const save = () => {
    const newSharecount = {
      name: sharecountName,
      currency: currency,
      participants: participantsNameArray,
    };
    addSharecountService(newSharecount).then(() => navigate("/"));
  };

  const listParticipants = participantsNameArray.map((p: string) => (
    <ListItem
      key={p}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => deleteParticipant(p)}
        >
          <ClearIcon />
        </IconButton>
      }
    >
      <ListItemText primary={p} />
    </ListItem>
  ));

  return (
    <div>
      <Header
        title="New Sharecount"
        cancelButton={true}
        saveButton={true}
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
            value={sharecountName}
            onChange={(e) => {
              setSharecountName(e.target.value);
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
              value={participantTextField}
              onChange={(e) => {
                setParticipantTextField(e.target.value);
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
