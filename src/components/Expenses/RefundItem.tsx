// React
import React from "react";

// MUI
import { List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { ISharecountContext } from "../../interfaces/interfaces";

interface IRefund {
  from: string;
  to: string;
  amount: number;
}

interface IPropsRefundItem {
  sharecount: ISharecountContext;
  refund: IRefund;
}

const RefundItem = (props: IPropsRefundItem) => {
  return (
    <List disablePadding>
      <ListItemButton>
        <ListItemText
          secondary={`
          ${props.refund.from} owes ${props.refund.to}`}
        />
        <ListItemText
          style={{ textAlign: "right" }}
          primaryTypographyProps={{
            variant: "subtitle1",
          }}
          primary={`${props.refund.amount.toFixed(2)} ${
            props.sharecount.currency
          }`}
        />
      </ListItemButton>
    </List>
  );
};

export default RefundItem;
