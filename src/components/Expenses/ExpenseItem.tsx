// Interfaces
import { IExpenseContext } from "../../interfaces/interfaces";

// Context
import UserContext from "../../context/user.context";

// React
import React, { useContext } from "react";

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
  const id = `id${props.expense.id.toString()}`;

  const { userContext } = useContext(UserContext);

  return (
    <List disablePadding id={id}>
      <ListItemButton>
        <ListItemText
          primaryTypographyProps={{
            variant: "h6",
          }}
          primary={props.expense.name}
          secondaryTypographyProps={{
            variant: "subtitle1",
          }}
          secondary={
            <React.Fragment>
              Paid by
              <Typography component="span">
                {`
                ${props.expense.owner.name}
                ${
                  props.expense.owner.name === userContext
                    ? " (me) "
                    : ""
                }`}
              </Typography>
            </React.Fragment>
          }
        />
        <ListItemText
          style={{ textAlign: "right" }}
          primaryTypographyProps={{
            variant: "h6",
          }}
          primary={`${props.expense.amount_total} ${props.sharecount?.currency}`}
          secondaryTypographyProps={{
            variant: "subtitle1",
          }}
        />
      </ListItemButton>
    </List>
  );
};

export default ExpenseItem;
