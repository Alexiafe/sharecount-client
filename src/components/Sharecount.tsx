import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

function Sharecount(props: any) {
  const sharecounts = props.sharecounts;

  const deleteSharecount = (sharecountID: any) => {
    return fetch(`http://localhost:3000/sharecount/${sharecountID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => console.log("update state"));
  };

  const listSharecounts = sharecounts.map((sharecount: any) => (
    <li key={sharecount.id}>
      <Link to={`/details/${sharecount.id}`}>{sharecount.name}</Link>
      <Link to={`/edit/${sharecount.id}`}>
        <Button variant="outlined" size="small">
          Edit
        </Button>
      </Link>
      <Button
        variant="outlined"
        size="small"
        onClick={() => deleteSharecount(sharecount.id)}
      >
        Delete
      </Button>
    </li>
  ));

  return (
    <div>
      <ul>{listSharecounts}</ul>
    </div>
  );
}

export default Sharecount;
