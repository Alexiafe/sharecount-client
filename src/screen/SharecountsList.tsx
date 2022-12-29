// Interfaces
import { ISharecountContext } from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import Loader from "../components/Common/Loader";
import MenuHome from "../components/Common/MenuHome";
import NotLoggedIn from "../components/Common/NotLoggedIn";
import Header from "../components/Common/Header";
import SharecountItem from "../components/Sharecounts/SharecountItem";

// Services
import { getUserService } from "../services/user.service";

// React
import { useContext, useEffect, useState } from "react";

const SharecountsList = () => {
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const [sharecounts, setSharecounts] = useState<ISharecountContext[]>([]);
  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);

  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession.email;

  useEffect(() => {
    if (userEmail) {
      setIsLoaded(false);
      if (sharecountsContext.length) {
        setSharecounts(sharecountsContext);
        setIsLoaded(true);
      } else {
        getUserService(userEmail).then(
          (sharecounts: ISharecountContext[]) => {
            setSharecounts(sharecounts);
            setSharecountsContext(sharecounts);
            setIsLoaded(true);
          },
          (error) => {
            setError(error);
            setIsLoaded(true);
          }
        );
      }
    }
  }, [userEmail, userLoading]);

  if (!isLoaded || userLoading) {
    return (
      <div>
        <Header></Header>
        <Loader></Loader>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Header></Header>
        Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div className="h-screen flex flex-col">
        <Header
          title={`Hi ${userSession.displayName!} !`}
          screen={"Home"}
        ></Header>
        <div className="flex flex-1 bg-primary overflow-auto">
          {sharecounts.length ? (
            <ul className="w-full">
              {sharecounts
                .sort((s1, s2) => s2.id - s1.id)
                .map((s: ISharecountContext) => (
                  <li key={s.id} className="py-2 px-5">
                    <SharecountItem sharecount={s}></SharecountItem>
                  </li>
                ))}
            </ul>
          ) : (
            <div className="p-4 text-center w-full text-white">
              <p>No sharecounts yet.</p>
              <p>Click the " + " button to create one</p>
            </div>
          )}
        </div>
        <footer className="flex w-full">
          <MenuHome screen="home"></MenuHome>
        </footer>
      </div>
    );
  }
};

export default SharecountsList;
