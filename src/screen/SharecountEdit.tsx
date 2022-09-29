// Interfaces
import { IParticipant, ISharecount } from "../interfaces/interfaces";

// Components
import Loader from "../components/Loader";
import Header from "../components/Header";

// Services
import {
  editSharecountService,
  getSharecountService,
} from "../services/sharecount.service";
import { deleteParticipantsService } from "../services/participants.service";

// React
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

const SharecountEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [sharecount, setSharecount] = useState<ISharecount | undefined>(
    undefined
  );
  const [sharecountName, setSharecountName] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [participant, setParticipant] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [oldParticipants, setOldParticipants] = useState<string[]>([]);

  const header = `Edit ${sharecount?.name}`;

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (result) => {
        setIsLoaded(true);
        setSharecount(result);
        setSharecountName(result.name);
        setCurrency(result.currency);
        setParticipants(result.participants.map((p: IParticipant) => p.name));
        setOldParticipants(
          result.participants.map((p: IParticipant) => p.name)
        );
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [params.sharecountID]);

  const editSharecountServer = (sharecount: any) => {
    editSharecountService(sharecount).then(() => navigate(-1));
  };

  const deleteParticipantsServer = (participants: string[]) => {
    deleteParticipantsService(participants, sharecount?.id!);
  };

  const addParticipants = () => {
    let cloneParticipants = [...participants];
    cloneParticipants.push(participant);
    setParticipants(cloneParticipants);
    setParticipant("");
  };

  const deleteParticipants = (participant: string) => {
    setParticipants(
      participants.filter((p: string) => {
        return p !== participant;
      })
    );
  };

  const save = () => {
    const participantsToAdd = participants.filter(
      (p: string) => !oldParticipants.includes(p)
    );

    const participantsToDelete = oldParticipants.filter(
      (p: string) => !participants.includes(p)
    );

    const newSharecount = {
      name: sharecountName,
      currency: currency,
      participants: participantsToAdd,
    };

    editSharecountServer(newSharecount);
    if (participantsToDelete.length)
      deleteParticipantsServer(participantsToDelete);
  };

  const listParticipants = participants.map((p: string) => (
    <ListItem
      key={p}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => deleteParticipants(p)}
        >
          <ClearIcon />
        </IconButton>
      }
    >
      <ListItemText primary={p} />
    </ListItem>
  ));

  if (error) {
    return (
      <div>
        <Header title={header} backButton={true}></Header>
        Please try again later
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        <Header title={header}></Header>
        <Loader></Loader>
      </div>
    );
  } else {
    return (
      <div>
        <Header
          title={header}
          cancelButton={true}
          saveButton={true}
          onClick={save}
        ></Header>
        <div className="flex flex-col m-2">
          <div className="m-2">
            <TextField
              required
              fullWidth
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
