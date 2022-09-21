import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SharecountItem from "./SharecountItem";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import Header from "../components/Header";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { ISharecount } from "../interfaces/interfaces";
import Loader from "./Loader";
import { serverUrl } from "../constants/config";

const SharecountList = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [sharecounts, setSharecounts] = useState<ISharecount[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [sharecountID, setSharecountID] = useState<number>(0);
  const [sharecountName, setSharecountName] = useState<string>("");

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
    fetch(`${serverUrl}/sharecounts`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setSharecounts(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const handleOpen = (sharecount: ISharecount) => {
    setSharecountID(sharecount.id);
    setSharecountName(sharecount.name);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const confirmDelete = () => {
    deleteSharecount(sharecountID);
    setOpen(false);
  };

  const deleteSharecount = (sharecountID: number) => {
    return fetch(`${serverUrl}/sharecount/${sharecountID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then(() => {
        setSharecounts(
          sharecounts.filter((s: ISharecount) => {
            return s.id !== sharecountID;
          })
        );
      });
  };

  const openSearchBar = () => {
    console.log("Open search bar");
  };

  const listSharecount = sharecounts.map((s: ISharecount) => (
    <li key={s.id}>
      <SharecountItem sharecount={s} onClick={handleOpen}></SharecountItem>
    </li>
  ));

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
  } else {
    return (
      <div>
        <Header
          title="Sharecount"
          searchButton="true"
          onClick={openSearchBar}
        ></Header>
        <ul className="m-2 border-solid">{listSharecount}</ul>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {sharecountName}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Confirm delete?
            </Typography>
            <div className="flex m-2 justify-center">
              <div>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
              <div className="mx-2">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => confirmDelete()}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
        <div className="absolute bottom-0 right-0">
          <IconButton
            color="primary"
            onClick={() => navigate("/sharecount-add")}
          >
            <AddCircleOutlineRoundedIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
    );
  }
};

export default SharecountList;
