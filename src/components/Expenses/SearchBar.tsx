// MUI
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";

interface IPropsSearchBar {
  onClick: (filter: string) => void;
}

const SearchBar = (props: IPropsSearchBar) => {
  return (
    <div className="px-4 pt-4">
      <TextField
        fullWidth
        size="small"
        placeholder="Search"
        onChange={(e) => {
          props.onClick(e.target.value);
        }}
        sx={{
          "& fieldset": { border: "none" },
        }}
        InputProps={{
          className: "bg-gray-100",
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchBar;
