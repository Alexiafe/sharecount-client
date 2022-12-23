// Interfaces
import { IUserInSharecountResponse } from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import Loader from "../components/Loader";
import MenuHome from "../components/MenuHome";
import NotLoggedIn from "../components/NotLoggedIn";
import Header from "../components/Header";

// Services
import { removeUserFromSharecount } from "../services/sharecount.service";
import { getUserService } from "../services/user.service";

// React
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI
import {
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface ISharecountList {
  id: number;
  name: string;
  currency: string;
  balance: number;
}

const SharecountsList = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [sharecounts, setSharecounts] = useState<ISharecountList[]>([]);
  const [selectedSharecount, setSelectedSharecount] = useState<ISharecountList>(
    { id: 0, name: "", currency: "", balance: 0 }
  );
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;
  const { sharecountsContext, setSharecountsContext } =
  useContext(SharecountsContext);

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
    if (userEmail) {
      setIsLoaded(false);
      if (sharecountsContext.length > 0) {
        setSharecounts(sharecountsContext);
        setIsLoaded(true);
      } else {
        getUserService(userEmail!).then(
          (user) => {
            setIsLoaded(true);
            setSharecounts(
              user.userInSharecount.map(
                (userInSharecount: IUserInSharecountResponse) => ({
                  id: userInSharecount.sharecount?.id,
                  name: userInSharecount.sharecount?.name,
                  currency: userInSharecount.sharecount?.currency,
                  balance: userInSharecount.participant?.balance,
                })
              )
            );
            setSharecountsContext(
              user.userInSharecount.map(
                (userInSharecount: IUserInSharecountResponse) => ({
                  id: userInSharecount.sharecount?.id,
                  name: userInSharecount.sharecount?.name,
                  currency: userInSharecount.sharecount?.currency,
                  balance: userInSharecount.participant?.balance,
                })
              )
            );
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
      }
    }
  }, [userEmail, userLoading]);

  const handleDisplayModal = (sharecount: ISharecountList) => {
    setSelectedSharecount(sharecount);
    setDisplayModal(true);
  };

  const handleCloseModal = () => setDisplayModal(false);

  const confirmDelete = () => {
    deleteSharecount(selectedSharecount);
    setDisplayModal(false);
  };

  const deleteSharecount = (sharecount: ISharecountList) => {
    setIsLoaded(false);
    let userInSharecountData = {
      sharecount_id: sharecount.id,
      user_email: userEmail!,
    };
    removeUserFromSharecount(userInSharecountData).then(
      () => {
        setSharecounts(
          sharecounts.filter((s: ISharecountList) => {
            return s.id !== sharecount.id;
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

  const listSharecounts = sharecounts.map((s: ISharecountList) => (
    <li key={s.id} className="py-2 px-5">
      <List disablePadding>
        <ListItemButton
          sx={{
            bgcolor: "white",
            borderRadius: "15px",
          }}
        >
          <ListItemText
            primaryTypographyProps={{
              variant: "h6",
            }}
            primary={s.name}
            secondaryTypographyProps={{
              variant: "subtitle1",
            }}
            secondary={
              <React.Fragment>
                Balance:
                {s.balance === 0 && (
                  <Typography component="span">
                    {` ${s.balance} ${s.currency} `}
                  </Typography>
                )}
                {s.balance > 0 && (
                  <Typography sx={{ color: "green" }} component="span">
                    {` +${s.balance} ${s.currency}
                  `}
                  </Typography>
                )}
                {s.balance < 0 && (
                  <Typography sx={{ color: "#E53935" }} component="span">
                    {` ${s.balance} ${s.currency}
                  `}
                  </Typography>
                )}
              </React.Fragment>
            }
            onClick={() => navigate(`/sharecount/${s.id}`)}
          />
          <IconButton
            size="large"
            onClick={() => navigate(`/sharecount/${s.id}`)}
          >
            <ChevronRightIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </ListItemButton>
      </List>
    </li>
  ));

  let modalContent = (
    <Box sx={style}>
      <Typography variant="h6">{selectedSharecount.name}</Typography>
      <Typography sx={{ mt: 2 }}>Confirm delete?</Typography>
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
        <Header></Header>
        <Loader></Loader>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Header></Header>
        Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div className="h-screen flex flex-col">
        <Header
          title={`Hi ${userSession.displayName!} !`}
          screen={"Home"}
        ></Header>
        <div className="flex flex-1 bg-primary overflow-auto">
          {sharecounts.length ? (
            <ul className="w-full">{listSharecounts}</ul>
          ) : (
            <div className="p-4 text-center w-full text-white">
              <p>No sharecounts yet.</p>
              <p>Click the " + " button to create one</p>
            </div>
          )}
        </div>
        <footer className="flex w-full">
          <MenuHome screen="home"></MenuHome>
        </footer>
        <Modal open={displayModal} onClose={handleCloseModal}>
          {modalContent}
        </Modal>
      </div>
    );
  }
};

export default SharecountsList;
