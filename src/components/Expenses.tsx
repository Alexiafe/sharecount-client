// Interfaces
import { ISharecountResponse } from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";

// Components
import Header from "./Header";
import MenuTabs from "./MenuTabs";
import NotLoggedIn from "../components/NotLoggedIn";

// Services
import { getSharecountService } from "../services/sharecount.service";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Expenses = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [sharecount, setSharecount] = useState<ISharecountResponse | undefined>(
    undefined
  );
  const { userSession } = useContext(AuthContext);
  const userEmail = userSession?.email;
  const header = sharecount?.name;

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (sharecount) => {
        setSharecount(sharecount);
      },
      (error) => {
        setError(error);
      }
    );
  }, [params.sharecountID]);

  const edit = () => {
    navigate(`/sharecount-edit/${params.sharecountID}`);
  };

  if (error) {
    return (
      <div>
        <Header title={header}></Header>
        Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div>
        <Header
          title={header}
          id={Number(params.sharecountID)}
          backButton={true}
          editButton={true}
          shareButton={true}
          onClick={edit}
          screen="Expenses"
        ></Header>
        <MenuTabs></MenuTabs>
      </div>
    );
  }
};

export default Expenses;
