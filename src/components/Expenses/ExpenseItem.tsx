// Interfaces
import { IExpenseContext } from "../../interfaces/interfaces";

// Context
import ExpensePositionContext from "../../context/expenseposition.context";

// React
import React from "react";
import { useContext } from "react";
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
  const navigate = useNavigate();
  const id = `id${props.expense.id.toString()}`;

  const { setExpenseIdContext, setExpensePositionContext } = useContext(
    ExpensePositionContext
  );

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
                  props.expense.owner.name === props.sharecount?.user
                    ? "(me)"
                    : ""
                }`}
              </Typography>
            </React.Fragment>
          }
          onClick={() => {
            const element = document.getElementById(`${id}`);
            const rect = element?.getBoundingClientRect();
            if (rect) {
              setExpenseIdContext(id);
              setExpensePositionContext(rect.top);
            }
            navigate(
              `/sharecount/${props.sharecount?.id}/expense/${props.expense.id}`
            );
          }}
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
          onClick={() =>
            navigate(
              `/sharecount/${props.sharecount?.id}/expense/${props.expense.id}`
            )
          }
        />
      </ListItemButton>
    </List>
  );
};

export default ExpenseItem;
