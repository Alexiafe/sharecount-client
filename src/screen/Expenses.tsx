// Interfaces
import { ISharecountContext } from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

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

  const [sharecount, setSharecount] = useState<ISharecountContext>();
  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);

  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;

  useEffect(() => {
    let currentSharecount = sharecountsContext.find(
      (sharecount) => sharecount.id === parseInt(params.sharecountID!)
    );
    if (currentSharecount?.expenses && currentSharecount?.participants) {
      setSharecount({
        id: currentSharecount.id,
        name: currentSharecount.name,
        currency: currentSharecount.currency,
        total: currentSharecount.total,
        user: currentSharecount.user,
        balance: currentSharecount.balance,
        participants: currentSharecount.participants,
        expenses: currentSharecount.expenses,
      });
      setIsLoaded(true);
    } else {
      getSharecountService(parseInt(params.sharecountID!)).then(
        (sharecount: ISharecountContext) => {
          setSharecount(sharecount);
          let filteredSharecounts = sharecountsContext.filter(
            (sharecount) => sharecount.id !== sharecount.id
          );
          setSharecountsContext([...filteredSharecounts, sharecount]);
          setIsLoaded(true);
        },
        (error) => {
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
      <div className="h-screen flex flex-col">
        <Header
          title={sharecount?.name}
          id={sharecount?.id}
          total={sharecount?.total}
          currency={sharecount?.currency}
          backButton={true}
          shareButton={true}
          screen="Expenses"
          onReturn={() => navigate(`/`)}
          onClick={edit}
        ></Header>
        <MenuTabs sharecount={sharecount}></MenuTabs>
      </div>
    );
  }
};

export default Expenses;
