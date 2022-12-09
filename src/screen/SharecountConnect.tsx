// Interfaces
import {
  IParticipantResponse,
  ISharecountResponse,
} from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";

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
  const [sharecount, setSharecount] = useState<ISharecountResponse | undefined>(
    undefined
  );
  const [participants, setParticipants] = useState<IParticipantResponse[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [value, setValue] = useState<number | null>(null);

  const header = sharecount?.name;

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (sharecount) => {
        setIsLoaded(true);
        setSharecount(sharecount);
        setParticipants(sharecount.participants);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [params.sharecountID]);

  const save = () => {
    const newSharecount = {
      id: parseInt(params.sharecountID!),
      user_email: userEmail!,
      participant_id: value!,
    };

    setIsLoaded(false);
    editSharecountService(newSharecount).then(() => {
      setIsLoaded(true);
      navigate("/");
    });
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
      {participants.map((p: IParticipantResponse) => (
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
        <Header title={header} backButton={true}></Header>
        Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div>
        <Header title={header}></Header>
        <div className="p-3 flex flex-col">
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
