// Interfaces
import { ISharecountResponse } from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";

// Components
import Header from "../components/Header";
import MenuTabs from "../components/MenuTabs";
import NotLoggedIn from "../components/NotLoggedIn";

// Services
import { getSharecountService } from "../services/sharecount.service";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";

const Expenses = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [sharecount, setSharecount] = useState<ISharecountResponse | undefined>(
    undefined
  );
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (sharecount) => {
        setIsLoaded(true);
        setSharecount(sharecount);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [params.sharecountID]);

  const edit = () => {
    navigate(`/sharecount-edit/${params.sharecountID}`);
  };

  if (!isLoaded || userLoading) {
    return (
      <div>
        <Header title={sharecount?.name}></Header>
        <Loader></Loader>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Header title={sharecount?.name}></Header>
        Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div className="h-screen flex flex-col">
        <Header
          title={sharecount?.name}
          id={sharecount?.id}
          total={sharecount?.total}
          currency={sharecount?.currency}
          backButton={true}
          editButton={true}
          shareButton={true}
          screen="Expenses"
          onClick={edit}
        ></Header>
        <MenuTabs></MenuTabs>
      </div>
    );
  }
};

export default Expenses;
