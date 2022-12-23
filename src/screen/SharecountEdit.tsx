// Interfaces
import { IParticipantResponse } from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";

// Components
import Header from "../components/Header";
import Loader from "../components/Loader";
import NotLoggedIn from "../components/NotLoggedIn";

// Services
import {
  editSharecountService,
  getSharecountService,
} from "../services/sharecount.service";
import { removeUserFromSharecount } from "../services/sharecount.service";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ClearIcon from "@mui/icons-material/Clear";

// Other
import { useFormik } from "formik";
import * as yup from "yup";

const SharecountEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [participantTextField, setParticipantTextField] = useState<string>("");
  const [participantsNameArray, setParticipantsNameArray] = useState<string[]>(
    []
  );
  const [error, setError] = useState<any>(null);
  const [participantError, setParticipantError] = useState<boolean>(false);

  const [oldparticipantsNameArray, setOldParticipantsNameArray] = useState<
    string[]
  >([]);
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;

  const header = `Edit sharecount`;

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    textAlign: "center",
    p: 4,
  };

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (sharecount) => {
        setIsLoaded(true);
        formik.setFieldValue("sharecountName", sharecount.name);
        formik.setFieldValue("currency", sharecount.currency);
        setParticipantsNameArray(
          sharecount.participants.map((p: IParticipantResponse) => p.name)
        );
        setOldParticipantsNameArray(
          sharecount.participants.map((p: IParticipantResponse) => p.name)
        );
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [params.sharecountID]);

  const confirmDelete = () => {
    deleteSharecount(Number(params.sharecountID));
    setDisplayModal(false);
  };

  const deleteSharecount = (sharecount_id: number) => {
    setIsLoaded(false);
    let userInSharecountData = {
      sharecount_id: sharecount_id,
      user_email: userEmail!,
    };
    removeUserFromSharecount(userInSharecountData).then(
      () => {
        setIsLoaded(true);
        navigate("/");
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  };

  const handleCloseModal = () => setDisplayModal(false);

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

    setIsLoaded(false);
    editSharecountService(newSharecount).then(() => {
      setIsLoaded(true);
      navigate(`/sharecount/${params.sharecountID}`);
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

  let modalContent = (
    <Box sx={style}>
      <Typography variant="h6" sx={{ m: 2 }}>
        Confirm delete?
      </Typography>
      <div className="flex justify-around">
        <div>
          <Button
            variant="outlined"
            sx={{ width: 100, margin: 0 }}
            onClick={() => setDisplayModal(false)}
          >
            Cancel
          </Button>
        </div>
        <div>
          <Button
            variant="outlined"
            sx={{ width: 100, margin: 0 }}
            onClick={() => confirmDelete()}
          >
            Delete
          </Button>
        </div>
      </div>
    </Box>
  );

  if (!isLoaded || userLoading) {
    return (
      <div>
        <Header title={header} cancelButton={true} saveButton={true}></Header>
        <Loader></Loader>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Header
          title={header}
          backButton={true}
          onReturn={() => navigate(`/sharecount/${params.sharecountID}`)}
        ></Header>
        Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div className="h-screen flex flex-col">
        <Header
          title={header}
          cancelButton={true}
          saveButton={true}
          onReturn={() => navigate(`/sharecount/${params.sharecountID}`)}
          onClick={() => formik.handleSubmit()}
        ></Header>
        <div className="flex flex-1 flex-col p-4 overflow-auto">
          <form className="flex flex-col" onSubmit={formik.handleSubmit}>
            <div className="py-2">
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
            <div className="py-2">
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
                sx={{ margin: 0, borderRadius: "4px", height: "30px" }}
                onClick={() => addParticipants()}
              >
                ADD
              </Button>
            </div>
          </div>
        </div>
        <footer className="flex w-full pb-6 justify-center">
          <Button
            variant="outlined"
            color="error"
            sx={{ width: 200, margin: 2 }}
            onClick={() => setDisplayModal(true)}
          >
            Delete
          </Button>
        </footer>
        <Modal open={displayModal} onClose={handleCloseModal}>
          {modalContent}
        </Modal>
      </div>
    );
  }
};

export default SharecountEdit;
