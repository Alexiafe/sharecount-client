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

// Other
import { useInView } from "react-cool-inview";

const SharecountsList = () => {
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [sharecounts, setSharecounts] = useState<ISharecountContext[]>([]);
  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession.email;

  const { observe } = useInView({
    onEnter: () => {
      handleLoadMore();
    },
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
            console.log(error);
            setError(error);
            setIsLoaded(true);
          }
        );
      }
    }
  }, [userEmail, userLoading]);

  const handleLoadMore = async () => {
    console.log("handleLoadMore", page);
    if (isLoaded) {
      const response: ISharecountContext[] = await getUserService(
        userEmail!,
        page
      );
      if (response.length) {
        let alreadyExist = sharecounts.find(
          (sharecount) => sharecount.id === response[0].id
        );
        if (!alreadyExist) {
          setSharecounts([...sharecounts, ...response]);
          setSharecountsContext([...sharecounts, ...response]);
        }
        setPage(page + 1);
      } else {
        setHasMore(false);
      }
    }
  };

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
      <div style={{ paddingTop: "150px", paddingBottom: "120px" }}>
        <Header
          title={`Hi ${userSession.displayName!} !`}
          screen={"Home"}
        ></Header>
        {sharecounts.length ? (
          <div className="bg-primary relative w-full">
            <ul className="w-full">
              {sharecounts.map((s: ISharecountContext) => (
                <li key={s.id} className="py-2 px-5">
                  <SharecountItem sharecount={s}></SharecountItem>
                </li>
              ))}
            </ul>
            <div ref={observe}>
              {hasMore ? <Loader key={0}></Loader> : <div></div>}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center w-full text-white">
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
          <MenuHome screen="home"></MenuHome>
        </footer>
      </div>
    );
  }
};

export default SharecountsList;
