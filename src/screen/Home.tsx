import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import Sharecount from "../components/Sharecount";
import Button from "@mui/material/Button";

const Home = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sharecounts, setSharecounts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/sharecounts")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          console.log(result);
          setSharecounts(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  return (
    <div>
      <Sharecount sharecounts={sharecounts}></Sharecount>
      <Button variant="outlined" size="small" onClick={() => navigate("/add")}>
        Add
      </Button>
    </div>
  );
};

export default Home;
