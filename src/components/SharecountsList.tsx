import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SharecountItem from "./SharecountItem";
import Button from "@mui/material/Button";

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
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <ul>{listSharecount}</ul>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate("/sharecount-add")}
        >
          New Sharecount
        </Button>
      </div>
    );
  }
}

export default SharecountList;
