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
import SharecountAddModal from "../components/Sharecounts/SharecountAddModal";

// Services
import { getUserService } from "../services/user.service";

// React
import { useContext, useEffect, useState } from "react";

// MUI
import { Dialog } from "@mui/material";

// Other
import { useInView } from "react-cool-inview";

const Sharecounts = () => {
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [sharecounts, setSharecounts] = useState<ISharecountContext[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession.email;

  const [displayModalSharecountAdd, setDisplayModalSharecountAdd] =
    useState<boolean>(false);

  const { observe } = useInView({
    onEnter: () => {
      handleLoadMore();
    },
  });

  useEffect(() => {
    if (userEmail) {
      setIsLoaded(false);
      if (sharecountsContext.length) {
        setSharecounts(sharecountsContext);
        setIsLoaded(true);
      } else {
        getUserService(userEmail).then(
          (sharecountsResponse: ISharecountContext[]) => {
            setSharecounts(sharecountsResponse);
            setSharecountsContext(sharecountsResponse);
            setIsLoaded(true);
          },
          (error) => {
            console.log(error);
            setError(error);
            setIsLoaded(true);
          }
        );
      }
    }
  }, [userEmail, userLoading]);

  const handleLoadMore = async () => {
    if (sharecounts.length < 10) {
      setHasMore(false);
      return;
    }
    let page = Math.round(sharecounts.length / 10);
    if (isLoaded) {
      const sharecountsResponse: ISharecountContext[] = await getUserService(
        userEmail!,
        page
      );
      if (sharecountsResponse.length) {
        setHasMore(true);
        let alreadyExist = sharecounts.find(
          (sharecount) => sharecount.id === sharecountsResponse[0].id
        );
        if (!alreadyExist) {
          setSharecounts([...sharecounts, ...sharecountsResponse]);
          setSharecountsContext([...sharecounts, ...sharecountsResponse]);
        }
      } else setHasMore(false);
    }
  };

  const handleCloseModalSharecountAdd = () =>
    setDisplayModalSharecountAdd(false);

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
      <div style={{ paddingTop: "170px", paddingBottom: "120px" }}>
        <div className="h-screen bg-primary fixed w-full"></div>
        <Header
          title={`Hi ${userSession.displayName!} !`}
          screen={"Home"}
        ></Header>
        {sharecounts.length ? (
          <div className="bg-primary">
            <ul>
              {sharecounts.map((s: ISharecountContext) => (
                <li key={s.id} className="py-2 px-5">
                  <SharecountItem sharecount={s}></SharecountItem>
                </li>
              ))}
            </ul>
            {hasMore ? (
              <div ref={observe}>
                <Loader key={0} color="white"></Loader>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className="relative p-4 text-center text-white">
            <p>No sharecounts yet.</p>
            <p>Click the " + " button to create one</p>
          </div>
        )}
        <footer
          className="fixed bottom-0 w-full flex"
          style={{
            height: "120px",
            zIndex: 101,
          }}
        >
          <MenuHome
            onAddClick={() => setDisplayModalSharecountAdd(true)}
            screen="home"
          ></MenuHome>
        </footer>
        <Dialog
          fullScreen
          open={displayModalSharecountAdd}
          onClose={handleCloseModalSharecountAdd}
        >
          <SharecountAddModal
            onReturn={handleCloseModalSharecountAdd}
          ></SharecountAddModal>
        </Dialog>
      </div>
    );
  }
};

export default Sharecounts;
