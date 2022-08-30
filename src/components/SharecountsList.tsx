import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SharecountItem from "./SharecountItem";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import Header from "../components/Header";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

function SharecountList() {
  const navigate = useNavigate();

  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sharecounts, setSharecounts] = useState([]);

  const [open, setOpen] = useState(false);
  const [sharecountID, setsharecountID] = useState(null);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    fetch("http://localhost:3000/sharecounts")
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

  const handleOpen = (id: any) => {
    setsharecountID(id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const confirmDelete = () => {
    deleteSharecount(sharecountID);
    setOpen(false);
  };

  const deleteSharecount = (sharecountID: any) => {
    return fetch(`http://localhost:3000/sharecount/${sharecountID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then(() => {
        setSharecounts(
          sharecounts.filter((sharecount: any) => {
            return sharecount.id !== sharecountID;
          })
        );
      });
  };

  const listSharecount = sharecounts.map((sharecount: any) => (
    <li key={sharecount.id}>
      <SharecountItem
        sharecount={sharecount}
        // onClick={deleteSharecount}
        onClick={handleOpen}
      ></SharecountItem>
    </li>
  ));

  if (error) {
    return (
      <div>
        <Header title="Sharecount"></Header>
        Error: {error.message}
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        <Header title="Sharecount"></Header>
        Loading...
      </div>
    );
  } else {
    return (
      <div>
        <Header title="Sharecount" searchButton="true"></Header>
        <ul className="m-2">{listSharecount}</ul>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Sharecount name
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Confirm delete?
            </Typography>
            <div className="flex m-2">
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
                  Save
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
}

export default SharecountList;
