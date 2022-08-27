import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, AppBar, Toolbar, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function Header(props: any) {
  const title = props.title;
  const backButton = props.backButton;

  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        {backButton && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
