// Context
import AuthContext from "../context/auth.context";

// Components
import Header from "../components/Header";
import NotLoggedIn from "../components/NotLoggedIn";
import Loader from "../components/Loader";

// Services
import { addSharecountService } from "../services/sharecount.service";

// React
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

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

// Other
import { useFormik } from "formik";
import * as yup from "yup";

const SharecountAdd = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [participantTextField, setParticipantTextField] = useState<string>("");
  const [participantsNameArray, setParticipantsNameArray] = useState<string[]>(
    []
  );
  const [participantError, setParticipantError] = useState<boolean>(false);

  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;
  const header = `New sharecount`;

  const addParticipants = () => {
    if (participantTextField.trim().length === 0) {
      setParticipantError(true);
      return;
    }
    let newParticipants = [...participantsNameArray];
    newParticipants.push(participantTextField);
    setParticipantsNameArray(newParticipants);
    setParticipantTextField("");
    setParticipantError(false);
  };

  const deleteParticipant = (participant: string) => {
    setParticipantsNameArray(
      participantsNameArray.filter((p: string) => {
        return p !== participant;
      })
    );
  };

  const save = (sharecount: { sharecountName: string; currency: string }) => {
    const newSharecount = {
      name: sharecount.sharecountName,
      currency: sharecount.currency,
      participantsToAdd: participantsNameArray,
    };

    setIsLoaded(false);
    addSharecountService(newSharecount).then((sharecount) => {
      navigate(`/sharecount-connect/${sharecount.id}`);
    });
  };

  const listParticipants = participantsNameArray.map((p: string) => (
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
  ));

  const validationSchema = yup.object({
    sharecountName: yup.string().required(),
    currency: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      sharecountName: "",
      currency: "",
    },
    validationSchema: validationSchema,
    validate: (data) => {
      let errors: any = {};

      if (data.sharecountName.trim().length === 0)
        errors.sharecountName = "Name is required";

      if (data.currency.trim().length === 0)
        errors.currency = "Currency is required";

      return errors;
    },
    onSubmit: (sharecount) => {
      save(sharecount);
      formik.resetForm();
    },
  });

  if (!isLoaded || userLoading) {
    return (
      <div>
        <Header title={header}></Header>
        <Loader></Loader>
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div>
        <Header
          title={header}
          cancelButton={true}
          saveButton={true}
          onReturn={() => navigate(`/`)}
          onClick={() => formik.handleSubmit()}
        ></Header>
        <div className="flex flex-col p-4">
          <form className="flex flex-col" onSubmit={formik.handleSubmit}>
            <div className="py-2">
              <TextField
                fullWidth
                required
                autoFocus
                id="sharecountName"
                name="sharecountName"
                label="Name"
                value={formik.values.sharecountName}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.sharecountName &&
                  Boolean(formik.errors.sharecountName)
                }
                helperText={
                  formik.touched.sharecountName && formik.errors.sharecountName
                }
              />
            </div>
            <div className="py-2">
              <TextField
                fullWidth
                required
                id="currency"
                name="currency"
                label="Currency"
                value={formik.values.currency}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.currency && Boolean(formik.errors.currency)
                }
                helperText={formik.touched.currency && formik.errors.currency}
              />
            </div>
          </form>
          <div className="py-2 text-text">
            Participants:
            <ul>{listParticipants}</ul>
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
                error={"Name is required" && participantError}
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
        </div>
      </div>
    );
  }
};

export default SharecountAdd;
