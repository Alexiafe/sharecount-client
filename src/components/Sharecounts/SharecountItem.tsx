// Interfaces
import { ISharecountContext } from "../../interfaces/interfaces";

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
          primary={props.sharecount.name}
          secondaryTypographyProps={{
            variant: "subtitle1",
          }}
          secondary={
            <React.Fragment>
              Balance:
              {props.sharecount.balance === 0 && (
                <Typography component="span">
                  {` ${props.sharecount.balance.toFixed(2)} ${
                    props.sharecount.currency
                  } `}
                </Typography>
              )}
              {props.sharecount.balance > 0 && (
                <Typography sx={{ color: "green" }} component="span">
                  {` +${props.sharecount.balance.toFixed(2)} ${
                    props.sharecount.currency
                  }
                  `}
                </Typography>
              )}
              {props.sharecount.balance < 0 && (
                <Typography sx={{ color: "#E53935" }} component="span">
                  {` ${props.sharecount.balance.toFixed(2)} ${
                    props.sharecount.currency
                  }
                  `}
                </Typography>
              )}
            </React.Fragment>
          }
          onClick={() => navigate(`/sharecount/${props.sharecount.id}`)}
        />
        <IconButton
          size="large"
          onClick={() => navigate(`/sharecount/${props.sharecount.id}`)}
        >
          <ChevronRightIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </ListItemButton>
    </List>
  );
};

export default SharecountItem;
