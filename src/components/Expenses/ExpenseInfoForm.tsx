// Context
import { IParticipantsContext } from "../../interfaces/interfaces";

// MUI
import { MenuItem, TextField } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";

interface IPropsExpenseInfoForm {
  formik: any;
  onSave: (expense: { expenseName: string; expenseAmount: string }) => void;
  expenseDate: moment.Moment | null;
  onHandleDateChange: (date: moment.Moment | null) => void;
  ownerID: number;
  onHandleOwnerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  participants: IParticipantsContext[];
}

const ExpenseInfoForm = (props: IPropsExpenseInfoForm) => {
  return (
    <div>
      <form className="flex flex-col" onSubmit={props.formik.handleSubmit}>
        <div className="py-2">
          <TextField
            fullWidth
            required
            autoFocus
            id="expenseName"
            name="expenseName"
            label="Name"
            value={props.formik.values.expenseName}
            onChange={props.formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={
              props.formik.touched.expenseName &&
              Boolean(props.formik.errors.expenseName)
            }
            helperText={
              props.formik.touched.expenseName &&
              props.formik.errors.expenseName
            }
          />
        </div>
        <div className="py-2">
          <TextField
            required
            fullWidth
            id="expenseAmount"
            name="expenseAmount"
            label="Amount"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            value={props.formik.values.expenseAmount}
            onChange={props.formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={
              props.formik.touched.expenseAmount &&
              Boolean(props.formik.errors.expenseAmount)
            }
            helperText={
              props.formik.touched.expenseAmount &&
              props.formik.errors.expenseAmount
            }
          />
        </div>
      </form>
      <div className="py-2">
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <MobileDatePicker
            label="Date"
            inputFormat="DD/MM/YYYY"
            value={props.expenseDate}
            onChange={props.onHandleDateChange}
            renderInput={(params) => (
              <TextField required fullWidth {...params} />
            )}
          />
        </LocalizationProvider>
      </div>
      <div className="py-2">
        <TextField
          fullWidth
          select
          label="Paid by:"
          value={props.ownerID || 0}
          onChange={props.onHandleOwnerChange}
        >
          {props.participants
            .sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            })
            .map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
        </TextField>
      </div>
    </div>
  );
};

export default ExpenseInfoForm;
