// MUI
import { CircularProgress } from "@mui/material";

interface IPropsLoader {
  color?: string;
}

const Loader = (props: IPropsLoader) => {
  return (
    <div className="p-4 text-center">
      {props.color === "white" ? (
        <CircularProgress sx={{ color: "white" }} />
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default Loader;
