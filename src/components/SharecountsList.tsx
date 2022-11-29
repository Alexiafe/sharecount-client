// Interfaces
import { ISharecountResponse } from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";

// Components
import Loader from "./Loader";
import Header from "../components/Header";
import NotLoggedIn from "../components/NotLoggedIn";

// Services
import {
  deleteSharecountService,
  getSharecountsService,
} from "../services/sharecount.service";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const SharecountsList = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [sharecounts, setSharecounts] = useState<ISharecountResponse[]>([]);
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [sharecountID, setSharecountID] = useState<number>(0);
  const [sharecountName, setSharecountName] = useState<string>("");
  const { userSession, loading } = useContext(AuthContext);
  const userEmail = userSession?.email;

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
    if (!loading) {
      getSharecountsService(userEmail!).then(
        (sharecounts) => {
          setIsLoaded(true);
          setSharecounts(sharecounts);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
    }
  }, [userEmail, loading]);

  const handleDisplayModal = (sharecount: ISharecountResponse) => {
    setSharecountID(sharecount.id);
    setSharecountName(sharecount.name);
    setDisplayModal(true);
  };

  const handleCloseModal = () => setDisplayModal(false);

  const confirmDelete = () => {
    deleteSharecount(sharecountID);
    setDisplayModal(false);
  };

  const deleteSharecount = (sharecountID: number) => {
    setIsLoaded(false);
    deleteSharecountService(sharecountID).then(
      () => {
        setSharecounts(
          sharecounts.filter((s: ISharecountResponse) => {
            return s.id !== sharecountID;
          })
        );
        setIsLoaded(true);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  };

  const listSharecounts = sharecounts.map((s: ISharecountResponse) => (
    <li key={s.id}>
      <List disablePadding>
        <ListItem button>
          <ListItemText
            primaryTypographyProps={{
              variant: "h6",
            }}
            primary={s.name}
            secondaryTypographyProps={{
              variant: "subtitle1",
            }}
            secondary={
              s.participants?.filter((p) => p.name === "Alexia").length
                ? `Balance : ${s.participants
                    ?.filter((p) => p.name === "Alexia")[0]
                    .balance.toFixed(2)} ${s.currency}`
                : ""
            }
            onClick={() => navigate(`/sharecount/${s.id}`)}
          />
          <IconButton
            size="large"
            color="primary"
            onClick={() => navigate(`/sharecount-edit/${s.id}`)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="large"
            color="primary"
            onClick={() => handleDisplayModal(s)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItem>
      </List>
    </li>
  ));

  let modalContent = (
    <Box sx={style}>
      <Typography variant="h6">{sharecountName}</Typography>
      <Typography sx={{ mt: 2 }}>Confirm delete?</Typography>
      <div className="flex m-2 justify-center">
        <div>
          <Button variant="outlined" onClick={() => setDisplayModal(false)}>
            Cancel
          </Button>
        </div>
        <div className="mx-2">
          <Button variant="outlined" onClick={() => confirmDelete()}>
            Delete
          </Button>
        </div>
      </div>
    </Box>
  );

  if (error) {
    return (
      <div>
        <Header title="Sharecount"></Header>
        Please try again later
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        <Header title="Sharecount"></Header>
        <Loader></Loader>
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div>
        <Header
          title="Sharecount"
          homeButton={true}
          emptyButtonL={true}
        ></Header>
        {sharecounts.length ? (
          <ul>{listSharecounts}</ul>
        ) : (
          <div className="p-3 text-center">
            <p>No sharecounts yet.</p>
            <p>Click the " + " button to create one</p>
          </div>
        )}
        <Modal open={displayModal} onClose={handleCloseModal}>
          {modalContent}
        </Modal>
        <div className="absolute bottom-4 right-4">
          <IconButton
            size="large"
            color="primary"
            onClick={() => navigate("/sharecount-add")}
          >
            <AddCircleOutlineRoundedIcon sx={{ fontSize: 45 }} />
          </IconButton>
        </div>
      </div>
    );
  }
};

export default SharecountsList;
