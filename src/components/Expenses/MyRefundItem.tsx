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

const MyRefundItem = (props: IPropsRefundItem) => {
  return (
    <List disablePadding>
      <ListItemButton
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: "15px",
        }}
      >
        <ListItemText
          secondary={
            <React.Fragment>
              <Typography component="span">
                {`
                ${props.refund.from}
                ${props.refund.from === props.sharecount?.user ? "(me)" : ""}`}
              </Typography>
              owes
              <Typography component="span">
                {`
                ${props.refund.to}
                ${props.refund.to === props.sharecount?.user ? "(me)" : ""}`}
              </Typography>
            </React.Fragment>
          }
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

export default MyRefundItem;
