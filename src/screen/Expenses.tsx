// Interfaces
import { ISharecountContext } from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import Header from "../components/Common/Header";
import NotLoggedIn from "../components/Common/NotLoggedIn";
import Loader from "../components/Common/Loader";
import MenuTabs from "../components/Expenses/MenuTabs";

// Services
import { getSharecountService } from "../services/sharecount.service";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Expenses = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [sharecount, setSharecount] = useState<ISharecountContext>();
  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;

  useEffect(() => {
    let currentSharecount = sharecountsContext.find(
      (s) => s.id === parseInt(params.sharecountID!)
    );
    if (currentSharecount?.participants) {
      setSharecount(currentSharecount);
      setIsLoaded(true);
    } else {
      getSharecountService(parseInt(params.sharecountID!)).then(
        (sharecount: ISharecountContext) => {
          setSharecount(sharecount);
          let newSharecountsContext = [...sharecountsContext];
          if (
            newSharecountsContext.find(
              (s) => s.id === parseInt(params.sharecountID!)
            )
          ) {
            newSharecountsContext.find(
              (s) => s.id === parseInt(params.sharecountID!)
            )!.participants = sharecount.participants;
            setSharecountsContext(newSharecountsContext);
          }
          setIsLoaded(true);
        },
        (error) => {
          console.log(error);
          setError(error);
          setIsLoaded(true);
        }
      );
    }
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
      <div style={{ paddingTop: "150px", paddingBottom: "20px" }}>
        <Header
          title={sharecount?.name}
          id={sharecount?.id}
          total={sharecount?.total}
          currency={sharecount?.currency}
          backButton={true}
          shareButton={true}
          screen="Home"
          onReturn={() => navigate(`/`)}
          onClick={edit}
        ></Header>
        <MenuTabs sharecount={sharecount}></MenuTabs>
        <footer
          className="fixed bottom-0 w-full"
          style={{
            height: "20px",
            zIndex: 101,
          }}
        ></footer>
      </div>
    );
  }
};

export default Expenses;
