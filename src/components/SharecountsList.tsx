import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SharecountItem from "./SharecountItem";
import { IconButton } from "@mui/material";
import Header from "../components/Header";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

function SharecountList() {
  const navigate = useNavigate();

  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sharecounts, setSharecounts] = useState([]);

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
        onClick={deleteSharecount}
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
        <div className="m-2">
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
