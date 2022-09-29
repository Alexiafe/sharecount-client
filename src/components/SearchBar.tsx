// MUI
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";

interface IPropsSearchBar {
  onClick: (filter: string) => void;
}

const SearchBar = (props: IPropsSearchBar) => {
  return (
    <div className="m-2">
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder="Search..."
        onChange={(e) => {
          props.onClick(e.target.value);
        }}
        InputProps={{
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