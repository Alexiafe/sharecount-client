// MUI
import { TextField } from "@mui/material";

interface IPropsSharecountInfoForm {
  formik: any;
  onSave: (sharecount: { sharecountName: string; currency: string }) => void;
}

const SharecountInfoForm = (props: IPropsSharecountInfoForm) => {
  return (
    <form className="flex flex-col" onSubmit={props.formik.handleSubmit}>
      <div className="py-2">
        <TextField
          fullWidth
          required
          autoFocus
          id="sharecountName"
          name="sharecountName"
          label="Name"
          value={props.formik.values.sharecountName}
          onChange={props.formik.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          error={
            props.formik.touched.sharecountName &&
            Boolean(props.formik.errors.sharecountName)
          }
          helperText={
            props.formik.touched.sharecountName &&
            props.formik.errors.sharecountName
          }
        />
      </div>
      <div className="py-2">
        <TextField
          fullWidth
          required
          id="currency"
          name="currency"
          label="Currency"
          value={props.formik.values.currency}
          onChange={props.formik.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          error={
            props.formik.touched.currency &&
            Boolean(props.formik.errors.currency)
          }
          helperText={
            props.formik.touched.currency && props.formik.errors.currency
          }
        />
      </div>
    </form>
  );
};

export default SharecountInfoForm;
