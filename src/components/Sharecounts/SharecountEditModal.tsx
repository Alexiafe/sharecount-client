// Interfaces
import {
  ISharecountContext,
  IParticipantsContext,
  IUserInSharecountDataForm,
  ISharecountForm,
} from "../../interfaces/interfaces";

// Context
import AuthContext from "../../context/auth.context";
import SharecountsContext from "../../context/sharecounts.context";

// Components
import HeaderThin from "../Common/HeaderThin";
import Loader from "../Common/Loader";
import NotLoggedIn from "../Common/NotLoggedIn";
import ModalContent from "../Common/ModalContent";
import ParticipantsList from "./ParticipantsList";
import SharecountInfoForm from "./SharecountInfoForm";

// Services
import { editSharecountService } from "../../services/sharecount.service";
import { removeUserFromSharecountService } from "../../services/sharecount.service";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import { Button, Modal } from "@mui/material";

// Other
import { useFormik } from "formik";
import * as yup from "yup";

interface IPropsSharecountAddModal {
  sharecount?: ISharecountContext;
  onReturn?: () => void;
}

const SharecountEditModal = (props: IPropsSharecountAddModal) => {
  const navigate = useNavigate();
  const params = useParams();
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [participantsNameArray, setParticipantsNameArray] = useState<string[]>(
    []
  );
  const [participantError, setParticipantError] = useState<string>("");
  const [error, setError] = useState<any>(null);
  const [oldparticipantsNameArray, setOldParticipantsNameArray] = useState<
    string[]
  >([]);
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;
  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);
  const header = `Edit sharecount`;

  useEffect(() => {
    if (props.sharecount) {
      formik.setFieldValue("sharecountName", props.sharecount.name);
      formik.setFieldValue("currency", props.sharecount.currency);
      setParticipantsNameArray(
        props.sharecount.participants!.map((p: IParticipantsContext) => p.name)
      );
      setOldParticipantsNameArray(
        props.sharecount.participants!.map((p: IParticipantsContext) => p.name)
      );
    }
  }, [props]);

  const confirmDelete = () => {
    deleteSharecount(Number(params.sharecountID));
    setDisplayModal(false);
  };

  const deleteSharecount = (sharecount_id: number) => {
    setIsLoaded(false);
    let userInSharecountData: IUserInSharecountDataForm = {
      sharecount_id: sharecount_id,
      user_email: userEmail!,
    };
    removeUserFromSharecountService(userInSharecountData).then(
      () => {
        navigate("/");
        setSharecountsContext(
          sharecountsContext.filter((s) => {
            return s.id !== sharecount_id;
          })
        );
        setIsLoaded(true);
      },
      (error) => {
        console.log(error);
        setError(error);
        setIsLoaded(true);
      }
    );
  };

  const handleCloseModal = () => setDisplayModal(false);

  const save = (sharecount: { sharecountName: string; currency: string }) => {
    setIsLoaded(false);

    const participantsToAdd = participantsNameArray.filter(
      (p: string) => !oldparticipantsNameArray.includes(p)
    );

    const participantsToDelete = oldparticipantsNameArray.filter(
      (p: string) => !participantsNameArray.includes(p)
    );

    const newSharecount: ISharecountForm = {
      id: parseInt(params.sharecountID!),
      name: sharecount.sharecountName,
      currency: sharecount.currency,
      participantsToAdd: participantsToAdd,
      participantsToDelete: participantsToDelete,
    };

    editSharecountService(newSharecount).then(
      (sharecountResponse: ISharecountContext) => {
        props.onReturn?.();
        if (sharecountsContext.find((s) => s.id === sharecountResponse.id)) {
          sharecountsContext.find((s) => s.id === sharecountResponse.id)!.name =
            sharecountResponse.name;
          sharecountsContext.find(
            (s) => s.id === sharecountResponse.id
          )!.currency = sharecountResponse.currency;
          sharecountsContext.find(
            (s) => s.id === sharecountResponse.id
          )!.participants = sharecountResponse.participants;
        }
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
        <HeaderThin
          title={header}
          cancelButton={true}
          saveButton={true}
        ></HeaderThin>
        <Loader></Loader>
      </div>
    );
  } else {
    return (
      <div className="h-screen flex flex-col">
        <HeaderThin
          title={header}
          cancelButton={true}
          saveButton={true}
          onCancel={() => props.onReturn?.()}
          onSave={() => formik.handleSubmit()}
        ></HeaderThin>
        <div className="flex flex-1 flex-col p-4 overflow-auto">
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
        <footer className="flex w-full pb-6 justify-center">
          <Button
            variant="outlined"
            color="error"
            sx={{ width: 200, margin: 2 }}
            onClick={() => setDisplayModal(true)}
          >
            Delete
          </Button>
        </footer>
        <Modal open={displayModal} onClose={handleCloseModal}>
          <div>
            <ModalContent
              onSetDisplayModal={(bool: boolean) => setDisplayModal(bool)}
              onConfirmDelete={() => confirmDelete()}
            ></ModalContent>
          </div>
        </Modal>
      </div>
    );
  }
};

export default SharecountEditModal;
