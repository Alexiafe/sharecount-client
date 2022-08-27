import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

const Edit = () => {
  const params = useParams();

  const title = `Edit ${params.id}`;

  return (
    <div>
      <Header title={title}></Header>
    </div>
  );
};

export default Edit;
