// Interfaces
import { ISharecountContext, ISharecountForm } from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import HeaderThin from "../components/Common/HeaderThin";
import NotLoggedIn from "../components/Common/NotLoggedIn";
import Loader from "../components/Common/Loader";
import ParticipantsList from "../components/Sharecounts/ParticipantsList";
import SharecountInfoForm from "../components/Sharecounts/SharecountInfoForm";

// Services
import { addSharecountService } from "../services/sharecount.service";

// React
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Other
import { useFormik } from "formik";
import * as yup from "yup";

const SharecountAdd = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [participantsNameArray, setParticipantsNameArray] = useState<string[]>(
    []
  );
  const [participantError, setParticipantError] = useState<string>("");
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession.email;
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
      (sharecount: ISharecountContext) => {
        sharecount.balance = 0;
        setSharecountsContext([...sharecountsContext, sharecount]);
        navigate(`/sharecount-connect/${sharecount.id}`);
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

  if (!isLoaded || userLoading) {
    return (
      <div>
        <HeaderThin title={header}></HeaderThin>
        <Loader></Loader>
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div>
        <HeaderThin
          title={header}
          cancelButton={true}
          saveButton={true}
          onCancel={() => navigate(`/`)}
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

export default SharecountAdd;
