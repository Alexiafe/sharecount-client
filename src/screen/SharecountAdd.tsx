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
import Loader from "../components/Loader";

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
  
  const header = `New sharecount`;

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

  const save = (sharecount: { sharecountName: string; currency: string }) => {
    const newSharecount = {
      name: sharecount.sharecountName,
      currency: sharecount.currency,
      participantsToAdd: participantsNameArray,
    };
    
    setIsLoaded(false);
    addSharecountService(newSharecount).then(() => {
      setIsLoaded(true);
      navigate("/");
    });
  };

  const listParticipants = participantsNameArray.map((p: string) => (
    <List disablePadding>
      <ListItem>
        <ListItemText primary={p} />
        <IconButton size="large" onClick={() => deleteParticipant(p)}>
          <ClearIcon />
        </IconButton>
      </ListItem>
    </List>
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

  if (!isLoaded) {
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
          onClick={() => formik.handleSubmit()}
        ></Header>
        <div className="flex flex-col p-4">
          <form className="flex flex-col" onSubmit={formik.handleSubmit}>
            <div className="py-2">
              <TextField
                fullWidth
                required
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
          <div className="py-2">
            Participants:
            <List>{listParticipants}</List>
            <div className="flex">
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
                InputProps={{
                  endAdornment: (
                    <IconButton
                      size="large"
                      edge="end"
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

export default SharecountAdd;
