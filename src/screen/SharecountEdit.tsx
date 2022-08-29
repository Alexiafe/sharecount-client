import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { Button, TextField } from "@mui/material";

const SharecountEdit = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sharecount, setSharecount] = useState<any>(null);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");

  const title = `Edit ${sharecount?.name}`;

  useEffect(() => {
    fetch(`http://localhost:3000/sharecount/${params.id}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setSharecount(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [params.id]);

  const editSharecount = (sharecount: any) => {
    return fetch(`http://localhost:3000/sharecount/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sharecount),
    }).then((data) => data.json());
  };

  const save = () => {
    const newSharecount = {
      name: name,
      currency: currency,
    };
    editSharecount(newSharecount);
    navigate(-1);
  };

  if (error) {
    return (
      <div>
        <Header title={title} backButton="true"></Header>
        Error: {error.message}
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        <Header title={title}></Header>
        Loading...
      </div>
    );
  } else {
    return (
      <div>
        <Header title={title} backButton="true"></Header>
        <div className="flex flex-col m-2">
          <div className="m-2">
            <TextField
              required
              fullWidth
              size="small"
              label="Name"
              variant="outlined"
              onChange={(e) => {
                setName(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="m-2">
            <TextField
              required
              fullWidth
              size="small"
              label="Currency"
              variant="outlined"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>

          <div className="flex m-2">
            <div>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
            <div className="mx-2">
              <Button variant="outlined" size="small" onClick={() => save()}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SharecountEdit;
