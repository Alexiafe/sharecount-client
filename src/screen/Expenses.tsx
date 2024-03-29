// Interfaces
import { IExpenseContext, ISharecountContext } from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";
import UserContext from "../context/user.context";

// Components
import Header from "../components/Common/Header";
import HeaderThin from "../components/Common/HeaderThin";
import NotLoggedIn from "../components/Common/NotLoggedIn";
import Loader from "../components/Common/Loader";
import MenuTabs from "../components/Expenses/MenuTabs";
import SharecountEditModal from "../components/Sharecounts/SharecountEditModal";

// Services
import { getSharecountService } from "../services/sharecount.service";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import { Dialog } from "@mui/material";

const Expenses = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [sharecount, setSharecount] = useState<ISharecountContext>();
  const { userContext } = useContext(UserContext);
  const { sharecountsContext } = useContext(SharecountsContext);
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;

  const [displayModalSharecountEdit, setDisplayModalSharecountEdit] =
    useState<boolean>(false);

  useEffect(() => {
    let currentSharecount = sharecountsContext.find(
      (s) => s.id === parseInt(params.sharecountID!)
    );
    if (currentSharecount) {
      if (currentSharecount.participants) {
        setSharecount(currentSharecount);
        setIsLoaded(true);
      } else {
        getSharecountService(parseInt(params.sharecountID!)).then(
          (sharecountResponse: ISharecountContext) => {
            setSharecount(sharecountResponse);
            currentSharecount!.participants = sharecountResponse.participants;
            currentSharecount!.expenses = sharecountResponse.expenses;
            setIsLoaded(true);
          },
          (error) => {
            console.log(error);
            setError(error);
            setIsLoaded(true);
          }
        );
      }
    } else {
      getSharecountService(parseInt(params.sharecountID!)).then(
        (sharecountResponse: ISharecountContext) => {
          setSharecount(sharecountResponse);
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

  const handleCloseModalSharecountEdit = () =>
    setDisplayModalSharecountEdit(false);

  const handleSaveSharecount = (sharecountResponse: ISharecountContext) => {
    setSharecount(sharecountResponse);

    // Update context
    if (sharecountsContext.find((s) => s.id === sharecountResponse.id)) {
      sharecountsContext.find((s) => s.id === sharecountResponse.id)!.name =
        sharecountResponse.name;
      sharecountsContext.find((s) => s.id === sharecountResponse.id)!.currency =
        sharecountResponse.currency;
      sharecountsContext.find(
        (s) => s.id === sharecountResponse.id
      )!.participants = sharecountResponse.participants;
      sharecountsContext.find(
        (s) => s.id === sharecountResponse.id
      )!.updated_at = sharecountResponse.updated_at;
    }
  };

  const handleAddExpense = (expense: IExpenseContext) => {
    // Update sharecount
    setSharecount(expense.sharecount);
    // Update context
    sharecountsContext.find((s) => s.id === sharecount?.id!)!.total =
      expense.sharecount?.total!;
    sharecountsContext.find((s) => s.id === sharecount?.id!)!.participants =
      expense.sharecount?.participants!;
    sharecountsContext.find((s) => s.id === sharecount?.id!)!.balance =
      expense.sharecount!.participants!.find(
        (p) => p?.name === userContext
      )!.balance!;
  };

  const handleEditExpense = (expense: IExpenseContext) => {
    // Update sharecount
    setSharecount(expense.sharecount);
    // Update context
    sharecountsContext.find((s) => s.id === sharecount?.id!)!.total =
      expense.sharecount?.total!;
    sharecountsContext.find((s) => s.id === sharecount?.id!)!.participants =
      expense.sharecount?.participants!;
    sharecountsContext.find((s) => s.id === sharecount?.id!)!.balance =
      expense.sharecount!.participants!.find(
        (p) => p?.name === userContext
      )!.balance!;
  };

  const handleDeleteExpense = (expense: IExpenseContext) => {
    // Update sharecount
    setSharecount(expense.sharecount);
    // Update context
    sharecountsContext.find((s) => s.id === sharecount?.id!)!.total =
      expense.sharecount?.total!;
    sharecountsContext.find((s) => s.id === sharecount?.id!)!.participants =
      expense.sharecount?.participants!;
    sharecountsContext.find((s) => s.id === sharecount?.id!)!.balance =
      expense.sharecount!.participants!.find(
        (p) => p?.name === userContext
      )!.balance!;
  };

  if (!isLoaded || userLoading) {
    return (
      <div>
        <Header title={sharecount?.name}></Header>
        <div style={{ paddingTop: "220px" }}>
          <Loader></Loader>
        </div>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <HeaderThin
          title={sharecount?.name}
          cancelButton={true}
          onCancel={() => navigate(-1)}
        ></HeaderThin>
        Please try again later Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div style={{ paddingTop: "170px" }}>
        <div className="h-screen bg-white fixed w-full"></div>
        <Header
          title={sharecount?.name}
          id={sharecount?.id}
          total={sharecount?.total}
          currency={sharecount?.currency}
          participants={sharecount?.participants}
          backButton={true}
          shareButton={true}
          screen="Expenses"
          onReturn={() => navigate(-1)}
          onTitleClick={() => {
            setDisplayModalSharecountEdit(true);
          }}
        ></Header>
        <MenuTabs
          sharecount={sharecount}
          onAddExpense={handleAddExpense}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        ></MenuTabs>
        <Dialog
          fullScreen
          open={displayModalSharecountEdit}
          onClose={handleCloseModalSharecountEdit}
        >
          <SharecountEditModal
            sharecount={sharecount}
            onReturn={handleCloseModalSharecountEdit}
            onSave={handleSaveSharecount}
          ></SharecountEditModal>
        </Dialog>
      </div>
    );
  }
};

export default Expenses;
