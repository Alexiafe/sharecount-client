// React
import { useState } from "react";

// MUI
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

interface IPropsParticipantsList {
  participantsNameArray: string[];
  onSetParticipantsNameArray: (participantsNameArray: string[]) => void;
  participantError: string;
}

const ParticipantsList = (props: IPropsParticipantsList) => {
  const participantsNameArray = props.participantsNameArray;
  const [nameError, setNameError] = useState<boolean>(false);
  const [participantTextField, setParticipantTextField] = useState<string>("");

  const addParticipants = () => {
    if (participantTextField.trim().length === 0) {
      setNameError(true);
      return;
    }
    let newParticipants = [...participantsNameArray];
    newParticipants.push(participantTextField);
    props.onSetParticipantsNameArray(newParticipants);
    setParticipantTextField("");
    setNameError(false);
  };

  const deleteParticipant = (participant: string) => {
    props.onSetParticipantsNameArray(
      participantsNameArray.filter((p: string) => {
        return p !== participant;
      })
    );
  };

  return (
    <div className="py-2 text-text">
      Participants:
      {participantsNameArray.length === 0 && (
        <div className="text-xs text-red-600">{props.participantError}</div>
      )}
      <ul>
        {participantsNameArray.map((p: string) => (
          <li key={p}>
            <List disablePadding>
              <ListItem>
                <ListItemText primary={p} />
                <IconButton size="large" onClick={() => deleteParticipant(p)}>
                  <ClearIcon />
                </IconButton>
              </ListItem>
            </List>
          </li>
        ))}
      </ul>
      <div className="flex py-4">
        <TextField
          fullWidth
          required
          label="New participant"
          variant="standard"
          value={participantTextField}
          onChange={(e) => {
            setParticipantTextField(e.target.value);
          }}
          InputLabelProps={{
            shrink: true,
          }}
          error={"Name is required" && nameError}
        />
        <Button
          className="self-end"
          style={{ marginLeft: "8px" }}
          variant="contained"
          sx={{ margin: 0, height: "30px" }}
          onClick={() => addParticipants()}
        >
          ADD
        </Button>
      </div>
    </div>
  );
};

export default ParticipantsList;
