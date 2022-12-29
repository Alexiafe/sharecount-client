// MUI
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";

interface IPropsModalContent {
  onSetDisplayModal: (bool: boolean) => void;
  onConfirmDelete: () => void;
}

const ModalContent = (props: IPropsModalContent) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    textAlign: "center",
    p: 4,
  };

  return (
    <Box sx={style}>
      <Typography variant="h6" sx={{ m: 2 }}>
        Confirm delete?
      </Typography>
      <div className="flex justify-around">
        <div>
          <Button
            variant="outlined"
            sx={{ width: 100, margin: 0 }}
            onClick={() => props.onSetDisplayModal(false)}
          >
            Cancel
          </Button>
        </div>
        <div>
          <Button
            variant="outlined"
            sx={{ width: 100, margin: 0 }}
            onClick={() => props.onConfirmDelete()}
          >
            Delete
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default ModalContent;
