import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, AppBar, Toolbar, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";

function Header(props: any) {
  const title = props.title;
  const backButton = props.backButton;
  const searchButton = props.searchButton;
  const editButton = props.editButton;

  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        {backButton && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosIcon />
          </IconButton>
        )}
        <Typography
          className="text-center"
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>
        {searchButton && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => navigate(-1)}
          >
            <SearchIcon />
          </IconButton>
        )}
        {editButton && "Edit"}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
