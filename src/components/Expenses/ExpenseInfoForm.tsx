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
  const formik = props.formik;
  const expenseDate = props.expenseDate;
  const ownerID = props.ownerID;
  const participants = props.participants;

  return (
    <div>
      <form className="flex flex-col" onSubmit={formik.handleSubmit}>
        <div className="py-2">
          <TextField
            fullWidth
            required
            autoFocus
            id="expenseName"
            name="expenseName"
            label="Name"
            value={formik.values.expenseName}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={
              formik.touched.expenseName && Boolean(formik.errors.expenseName)
            }
            helperText={formik.touched.expenseName && formik.errors.expenseName}
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
            value={formik.values.expenseAmount}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={
              formik.touched.expenseAmount &&
              Boolean(formik.errors.expenseAmount)
            }
            helperText={
              formik.touched.expenseAmount && formik.errors.expenseAmount
            }
          />
        </div>
      </form>
      <div className="py-2">
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <MobileDatePicker
            label="Date"
            inputFormat="DD/MM/YYYY"
            value={expenseDate}
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
          value={ownerID || 0}
          onChange={props.onHandleOwnerChange}
        >
          {participants.map((p) => (
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
