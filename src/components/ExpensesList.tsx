// Interfaces
import {
  ISharecountResponse,
  IExpenseResponse,
} from "../interfaces/interfaces";

// Components
import SearchBar from "./SearchBar";
import Loader from "./Loader";

// Services
import { getSharecountService } from "../services/sharecount.service";
import { deleteExpenseService } from "../services/expense.service";

// React
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteIcon from "@mui/icons-material/Delete";

// Other
import moment from "moment";

const ExpensesList = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [sharecount, setSharecount] = useState<ISharecountResponse | undefined>(
    undefined
  );
  const [expenses, setExpenses] = useState<IExpenseResponse[]>([]);
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [expenseID, setExpenseID] = useState<number>(0);
  const [expenseName, setExpenseName] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    textAlign: "center",
    p: 4,
  };

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (sharecount) => {
        setIsLoaded(true);
        setSharecount(sharecount);
        setExpenses(sharecount.expenses);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [params.sharecountID]);

  const handleDisplayModal = (expense: IExpenseResponse) => {
    setExpenseID(expense.id);
    setExpenseName(expense.name);
    setDisplayModal(true);
  };

  const handleCloseModal = () => setDisplayModal(false);

  const confirmDelete = () => {
    deleteExpense(expenseID);
    setDisplayModal(false);
  };

  const deleteExpense = (expenseID: number) => {
    setIsLoaded(false);
    deleteExpenseService(expenseID).then(
      () => {
        setExpenses(
          expenses.filter((e: IExpenseResponse) => {
            return e.id !== expenseID;
          })
        );
        setIsLoaded(true);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  };

  const filterExpenses = (filter: string) => {
    setFilter(filter);
  };

  const listExpenses = expenses
    ?.filter((e) => e.name.toLowerCase().includes(filter.toLowerCase()))
    .map((e) => (
      <li key={e.id}>
        <List disablePadding>
          <ListItem button>
            <ListItemText
              primaryTypographyProps={{
                variant: "h6",
              }}
              primary={e.name}
              secondaryTypographyProps={{
                variant: "subtitle1",
              }}
              secondary={`Paid by ${e.owner?.name} ${
                e.owner?.name ===
                sharecount?.userInSharecount[0].participant.name
                  ? "(me)"
                  : ""
              }`}
              onClick={() =>
                navigate(`/sharecount/${sharecount?.id}/expense/${e.id}`)
              }
            />
            <ListItemText
              style={{ textAlign: "right" }}
              primaryTypographyProps={{
                variant: "h6",
              }}
              primary={`${e.amount_total} ${sharecount?.currency}`}
              secondaryTypographyProps={{
                variant: "subtitle1",
              }}
              secondary={
                moment(e.date).isSame(moment(), "day")
                  ? "Today"
                  : moment(e.date).format("DD/MM/YYYY")
              }
              onClick={() =>
                navigate(`/sharecount/${sharecount?.id}/expense/${e.id}`)
              }
            />
            <IconButton
              size="large"
              color="primary"
              onClick={() => handleDisplayModal(e)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        </List>
      </li>
    ));

  let modalContent = (
    <Box sx={style}>
      <Typography variant="h6">{expenseName}</Typography>
      <Typography sx={{ mt: 2 }}>Confirm delete?</Typography>
      <div className="flex m-2 justify-center">
        <div>
          <Button variant="outlined" onClick={() => setDisplayModal(false)}>
            Cancel
          </Button>
        </div>
        <div className="mx-2">
          <Button variant="outlined" onClick={() => confirmDelete()}>
            Delete
          </Button>
        </div>
      </div>
    </Box>
  );

  if (error) {
    return <div>Please try again later</div>;
  } else if (!isLoaded) {
    return (
      <div>
        <Loader></Loader>
      </div>
    );
  } else {
    return (
      <div>
        {!expenses || expenses.length > 0 ? (
          <div>
            <SearchBar onClick={filterExpenses}></SearchBar>
            <div>
              <ul>{listExpenses}</ul>
              <Modal open={displayModal} onClose={handleCloseModal}>
                {modalContent}
              </Modal>
            </div>
          </div>
        ) : (
          <div className="p-3 text-center">
            <p>No expenses yet.</p>
            <p>Click the " + " button to create one</p>
          </div>
        )}

        <div className="absolute bottom-4 right-4">
          <IconButton
            size="large"
            color="primary"
            onClick={() =>
              navigate(`/sharecount/${params.sharecountID}/expense-add`)
            }
          >
            <AddCircleOutlineRoundedIcon sx={{ fontSize: 45 }} />
          </IconButton>
        </div>
      </div>
    );
  }
};

export default ExpensesList;
