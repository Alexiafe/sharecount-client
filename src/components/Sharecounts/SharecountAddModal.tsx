// Interfaces
import {
  ISharecountContext,
  ISharecountForm,
} from "../../interfaces/interfaces";

// Context
import SharecountsContext from "../../context/sharecounts.context";

// Components
import HeaderThin from "../Common/HeaderThin";
import Loader from "../Common/Loader";
import ParticipantsList from "./ParticipantsList";
import SharecountInfoForm from "./SharecountInfoForm";

// Services
import { addSharecountService } from "../../services/sharecount.service";

// React
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Other
import { useFormik } from "formik";
import * as yup from "yup";

interface IPropsExpenseDetailsModal {
  onReturn?: () => void;
}

const SharecountAddModal = (props: IPropsExpenseDetailsModal) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [participantsNameArray, setParticipantsNameArray] = useState<string[]>(
    []
  );
  const [participantError, setParticipantError] = useState<string>("");
  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);
  const header = `New sharecount`;

  const save = (sharecount: { sharecountName: string; currency: string }) => {
    setIsLoaded(false);
    const newSharecount: ISharecountForm = {
      name: sharecount.sharecountName,
      currency: sharecount.currency,
      participantsToAdd: participantsNameArray,
    };
    addSharecountService(newSharecount).then(
      (sharecountResponse: ISharecountContext) => {
        sharecountResponse.balance = 0;
        setSharecountsContext([...sharecountsContext, sharecountResponse]);
        navigate(`/sharecount-connect/${sharecountResponse.id}`);
        setIsLoaded(true);
      }
    );
  };

  const validationSchema = yup.object({
    sharecountName: yup.string().required(),
    currency: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      sharecountName: "",
      currency: "",
    },
    validationSchema: validationSchema,
    validate: (data) => {
      let errors: any = {};

      if (data.sharecountName.trim().length === 0)
        errors.sharecountName = "Name is required";

      if (data.currency.trim().length === 0)
        errors.currency = "Currency is required";

      return errors;
    },
    onSubmit: (sharecount) => {
      if (participantsNameArray.length === 0)
        setParticipantError("Select at least one participant");
      else {
        save(sharecount);
        formik.resetForm();
      }
    },
  });

  if (!isLoaded) {
    return (
      <div>
        <HeaderThin title={header}></HeaderThin>
        <Loader></Loader>
      </div>
    );
  } else {
    return (
      <div>
        <HeaderThin
          title={header}
          cancelButton={true}
          saveButton={true}
          onCancel={() => props.onReturn?.()}
          onSave={() => formik.handleSubmit()}
        ></HeaderThin>
        <div className="flex flex-col p-4">
          <SharecountInfoForm
            formik={formik}
            onSave={(sharecount: {
              sharecountName: string;
              currency: string;
            }) => save(sharecount)}
          ></SharecountInfoForm>
          <ParticipantsList
            participantsNameArray={participantsNameArray}
            onSetParticipantsNameArray={(p: string[]) =>
              setParticipantsNameArray(p)
            }
            participantError={participantError}
          ></ParticipantsList>
        </div>
      </div>
    );
  }
};

export default SharecountAddModal;
