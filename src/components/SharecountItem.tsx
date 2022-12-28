// Interfaces
import { ISharecountContext } from "../interfaces/interfaces";

// React
import React from "react";
import { useNavigate } from "react-router-dom";

// MUI
import {
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface IPropsSharecountItem {
  sharecount: ISharecountContext;
}

const SharecountItem = (props: IPropsSharecountItem) => {
  const sharecount = props.sharecount;
  const navigate = useNavigate();

  return (
    <List disablePadding>
      <ListItemButton
        sx={{
          bgcolor: "white",
          borderRadius: "15px",
        }}
      >
        <ListItemText
          primaryTypographyProps={{
            variant: "h6",
          }}
          primary={sharecount.name}
          secondaryTypographyProps={{
            variant: "subtitle1",
          }}
          secondary={
            <React.Fragment>
              Balance:
              {sharecount.balance === 0 && (
                <Typography component="span">
                  {` ${sharecount.balance.toFixed(2)} ${sharecount.currency} `}
                </Typography>
              )}
              {sharecount.balance > 0 && (
                <Typography sx={{ color: "green" }} component="span">
                  {` +${sharecount.balance.toFixed(2)} ${sharecount.currency}
                  `}
                </Typography>
              )}
              {sharecount.balance < 0 && (
                <Typography sx={{ color: "#E53935" }} component="span">
                  {` ${sharecount.balance.toFixed(2)} ${sharecount.currency}
                  `}
                </Typography>
              )}
            </React.Fragment>
          }
          onClick={() => navigate(`/sharecount/${sharecount.id}`)}
        />
        <IconButton
          size="large"
          onClick={() => navigate(`/sharecount/${sharecount.id}`)}
        >
          <ChevronRightIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </ListItemButton>
    </List>
  );
};

export default SharecountItem;
