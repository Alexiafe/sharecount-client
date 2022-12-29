// Interfaces
import {
  ISharecountContext,
  IExpenseResponse,
  IPartakerResponse,
  IParticipantResponse,
  IParticipantsContext,
  ISharecountResponse,
  IUserInSharecountDataForm,
  ISharecountForm,
} from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import NotLoggedIn from "../components/Common/NotLoggedIn";
import ModalContent from "../components/Common/ModalContent";
import ParticipantsList from "../components/Sharecounts/ParticipantsList";
import SharecountInfoForm from "../components/Sharecounts/SharecountInfoForm";

// Services
import {
  editSharecountService,
  getSharecountService,
} from "../services/sharecount.service";
import { removeUserFromSharecount } from "../services/sharecount.service";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import { Button, Modal } from "@mui/material";

// Other
import { useFormik } from "formik";
import * as yup from "yup";

const SharecountEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
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
    let currentSharecount = sharecountsContext.find(
      (s) => s.id === parseInt(params.sharecountID!)
    );
    if (currentSharecount) {
      formik.setFieldValue("sharecountName", currentSharecount.name);
      formik.setFieldValue("currency", currentSharecount.currency);
      setParticipantsNameArray(
        currentSharecount.participants!.map((p: IParticipantsContext) => p.name)
      );
      setOldParticipantsNameArray(
        currentSharecount.participants!.map((p: IParticipantsContext) => p.name)
      );
      setIsLoaded(true);
    } else {
      getSharecountService(parseInt(params.sharecountID!)).then(
        (sharecount: ISharecountContext) => {
          formik.setFieldValue("sharecountName", sharecount.name);
          formik.setFieldValue("currency", sharecount.currency);
          let participantsName = sharecount.participants?.map(
            (p: IParticipantsContext) => {
              return p.name;
            }
          );
          setParticipantsNameArray(participantsName!);
          setOldParticipantsNameArray(participantsName!);
          setIsLoaded(true);
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );
    }
  }, [params.sharecountID]);

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
    removeUserFromSharecount(userInSharecountData).then(
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
      (sharecount: ISharecountResponse) => {
        let currentSharecount: ISharecountContext = sharecountsContext.find(
          (s) => s.id === parseInt(params.sharecountID!)
        )!;
        currentSharecount.name = sharecount.name;
        currentSharecount.currency = sharecount.currency;
        currentSharecount.participants = sharecount.participants!.map(
          (p: IParticipantResponse) => ({
            id: p.id,
            name: p.name,
            balance: p.balance,
          })
        );
        currentSharecount.expenses = sharecount.expenses!.map(
          (e: IExpenseResponse) => ({
            id: e.id,
            name: e.name,
            amount_total: e.amount_total,
            date: e.date,
            owner: {
              id: e.owner.id,
              name: e.owner.name,
            },
            partakers: e.partakers.map((p: IPartakerResponse) => ({
              id: p.participant_id,
              name: p.participant.name,
              amount: p.amount,
            })),
          })
        );
        navigate(`/sharecount/${params.sharecountID}`);
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
        <Header title={header} cancelButton={true} saveButton={true}></Header>
        <Loader></Loader>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Header
          title={header}
          backButton={true}
          onReturn={() => navigate(`/sharecount/${params.sharecountID}`)}
        ></Header>
        Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div className="h-screen flex flex-col">
        <Header
          title={header}
          cancelButton={true}
          saveButton={true}
          onReturn={() => navigate(`/sharecount/${params.sharecountID}`)}
          onClick={() => formik.handleSubmit()}
        ></Header>
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

export default SharecountEdit;
