// MUI
import { TextField } from "@mui/material";

interface IPropsSharecountInfoForm {
  formik: any;
  onSave: (sharecount: { sharecountName: string; currency: string }) => void;
}

const SharecountInfoForm = (props: IPropsSharecountInfoForm) => {
  const formik = props.formik;

  return (
    <form className="flex flex-col" onSubmit={formik.handleSubmit}>
      <div className="py-2">
        <TextField
          fullWidth
          required
          autoFocus
          id="sharecountName"
          name="sharecountName"
          label="Name"
          value={formik.values.sharecountName}
          onChange={formik.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          error={
            formik.touched.sharecountName &&
            Boolean(formik.errors.sharecountName)
          }
          helperText={
            formik.touched.sharecountName && formik.errors.sharecountName
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
          value={formik.values.currency}
          onChange={formik.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          error={formik.touched.currency && Boolean(formik.errors.currency)}
          helperText={formik.touched.currency && formik.errors.currency}
        />
      </div>
    </form>
  );
};

export default SharecountInfoForm;
