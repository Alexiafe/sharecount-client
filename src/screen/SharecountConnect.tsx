// Interfaces
import {
  ISharecountContext,
  IParticipantsContext,
  ISharecountResponse,
  IParticipantResponse,
  IExpenseResponse,
  IPartakerResponse,
} from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import Loader from "../components/Loader";
import Header from "../components/Header";
import NotLoggedIn from "../components/NotLoggedIn";

// Services
import {
  editSharecountService,
  getSharecountService,
} from "../services/sharecount.service";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material/";

const SharecountConnect = () => {
  const { userSession, userLoading } = useContext(AuthContext);
  const userEmail = userSession?.email;
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [sharecount, setSharecount] = useState<ISharecountContext>();
  const [participants, setParticipants] = useState<IParticipantsContext[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [value, setValue] = useState<number | null>(null);

  const { sharecountsContext, setSharecountsContext } =
    useContext(SharecountsContext);

  const header = sharecount?.name;

  useEffect(() => {
    let currentSharecount = sharecountsContext.find(
      (sharecount) => sharecount.id === parseInt(params.sharecountID!)
    );
    if (currentSharecount?.participants?.length) {
      setSharecount(currentSharecount);
      setParticipants(currentSharecount.participants!);
      setIsLoaded(true);
    } else {
      getSharecountService(parseInt(params.sharecountID!)).then(
        (sharecount: ISharecountContext) => {
          setSharecount(sharecount);
          setParticipants(sharecount.participants!);
          setIsLoaded(true);
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );
    }
  }, [params.sharecountID]);

  const save = () => {
    setIsLoaded(false);

    const newSharecount = {
      id: parseInt(params.sharecountID!),
      user_email: userEmail!,
      participant_id: value!,
    };

    editSharecountService(newSharecount).then(
      (sharecount: ISharecountResponse) => {
        let currentSharecount: ISharecountContext = sharecountsContext.find(
          (sharecount) => sharecount.id === parseInt(params.sharecountID!)
        )!;
        currentSharecount.name = sharecount.name;
        currentSharecount.currency = sharecount.currency;
        currentSharecount.participants = sharecount.participants!.map(
          (participant: IParticipantResponse) => ({
            id: participant.id,
            name: participant.name,
            balance: participant.balance,
          })
        );
        currentSharecount.expenses = sharecount.expenses!.map(
          (expense: IExpenseResponse) => ({
            id: expense.id,
            name: expense.name,
            amount_total: expense.amount_total,
            date: expense.date,
            owner: {
              id: expense.owner.id,
              name: expense.owner.name,
            },
            partakers: expense.partakers.map((partaker: IPartakerResponse) => ({
              id: partaker.participant_id,
              name: partaker.participant.name,
              amount: partaker.amount,
            })),
          })
        );
        navigate("/");
        setIsLoaded(true);
      }
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(event.target.value));
  };

  const listSharecountParticipants = (
    <RadioGroup
      aria-labelledby="demo-radio-buttons-group-label"
      defaultValue="female"
      name="radio-buttons-group"
      value={value}
      onChange={handleChange}
    >
      {participants.map((p: IParticipantsContext) => (
        <FormControlLabel
          key={p.id}
          value={p.id}
          control={<Radio />}
          label={p.name}
        />
      ))}
    </RadioGroup>
  );

  if (!isLoaded || userLoading) {
    return (
      <div>
        <Header title={header}></Header>
        <Loader></Loader>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Header
          title={header}
          cancelButton={true}
          onReturn={() => navigate(`/`)}
        ></Header>
        Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div>
        <Header title={header}></Header>
        <div className="p-4 flex flex-col">
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Select who you are:
            </FormLabel>
            {listSharecountParticipants}
          </FormControl>
          <Button
            variant="contained"
            sx={{ width: 200, margin: 2 }}
            onClick={() => save()}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
};

export default SharecountConnect;
