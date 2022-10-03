// Interfaces
import { IParticipantResponse } from "../interfaces/interfaces";

// Components
import Loader from "../components/Loader";
import Header from "../components/Header";

// Services
import {
  editSharecountService,
  getSharecountService,
} from "../services/sharecount.service";

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

// Other
import { useFormik } from "formik";
import * as yup from "yup";

const SharecountEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [participantTextField, setParticipantTextField] = useState<string>("");
  const [participantsNameArray, setParticipantsNameArray] = useState<string[]>(
    []
  );
  const [oldparticipantsNameArray, setOldParticipantsNameArray] = useState<
    string[]
  >([]);

  const header = `Edit sharecount`;

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (result) => {
        setIsLoaded(true);
        formik.setFieldValue("sharecountName", result.name);
        formik.setFieldValue("currency", result.currency);
        setParticipantsNameArray(
          result.participants.map((p: IParticipantResponse) => p.name)
        );
        setOldParticipantsNameArray(
          result.participants.map((p: IParticipantResponse) => p.name)
        );
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [params.sharecountID]);

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
    const participantsToAdd = participantsNameArray.filter(
      (p: string) => !oldparticipantsNameArray.includes(p)
    );

    const participantsToDelete = oldparticipantsNameArray.filter(
      (p: string) => !participantsNameArray.includes(p)
    );

    const newSharecount = {
      id: parseInt(params.sharecountID!),
      name: sharecount.sharecountName,
      currency: sharecount.currency,
      participantsToAdd: participantsToAdd,
      participantsToDelete: participantsToDelete,
    };

    editSharecountService(newSharecount).then(() => navigate("/"));
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

  const validationSchema = yup.object({
    sharecountName: yup.string().required(`Sharecount's name is required`),
    currency: yup.string().required("Currency is required"),
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
          onClick={() => formik.handleSubmit()}
        ></Header>
        <div className="flex flex-col p-3">
          <form className="flex flex-col" onSubmit={formik.handleSubmit}>
            <div className="m-2">
              <TextField
                required
                fullWidth
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
            <div className="m-2">
              <TextField
                required
                fullWidth
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
          <div>
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
