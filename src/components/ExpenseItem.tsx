// Interfaces
import { IExpenseContext } from "../interfaces/interfaces";

// React
import React from "react";
import { useNavigate } from "react-router-dom";

// MUI
import { List, ListItemButton, ListItemText, Typography } from "@mui/material";

interface ISharecount {
  id: number;
  currency: string;
  user: string;
}

interface IPropsExpenseItem {
  sharecount: ISharecount | undefined;
  expense: IExpenseContext;
}

const ExpenseItem = (props: IPropsExpenseItem) => {
  const sharecount = props.sharecount;
  const expense = props.expense;

  const navigate = useNavigate();

  return (
    <List disablePadding>
      <ListItemButton>
        <ListItemText
          primaryTypographyProps={{
            variant: "h6",
          }}
          primary={expense.name}
          secondaryTypographyProps={{
            variant: "subtitle1",
          }}
          secondary={
            <React.Fragment>
              Paid by
              <Typography component="span">
                {`
                ${expense.owner.name}
                ${expense.owner.name === sharecount?.user ? "(me)" : ""}`}
              </Typography>
            </React.Fragment>
          }
          onClick={() =>
            navigate(`/sharecount/${sharecount?.id}/expense/${expense.id}`)
          }
        />
        <ListItemText
          style={{ textAlign: "right" }}
          primaryTypographyProps={{
            variant: "h6",
          }}
          primary={`${expense.amount_total} ${sharecount?.currency}`}
          secondaryTypographyProps={{
            variant: "subtitle1",
          }}
          onClick={() =>
            navigate(`/sharecount/${sharecount?.id}/expense/${expense.id}`)
          }
        />
      </ListItemButton>
    </List>
  );
};

export default ExpenseItem;
