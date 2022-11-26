// Interfaces
import { ISharecountResponse } from "../interfaces/interfaces";

// Components
import Header from "./Header";
import MenuTabs from "./MenuTabs";

// Services
import { getSharecountService } from "../services/sharecount.service";

// React
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Expenses = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [sharecount, setSharecount] = useState<ISharecountResponse | undefined>(
    undefined
  );
  const header = sharecount?.name;

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

  if (error) {
    return (
      <div>
        <Header title={header}></Header>
        Please try again later
      </div>
    );
  } else {
    return (
      <div>
        <Header
          title={header}
          backButton={true}
          editButton={true}
          onClick={edit}
          screen="Expenses"
        ></Header>
        <MenuTabs></MenuTabs>
      </div>
    );
  }
};

export default Expenses;
