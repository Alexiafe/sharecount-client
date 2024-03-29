// Interfaces
import {
  ISharecountContext,
  IParticipantsContext,
  ISharecountForm,
} from "../interfaces/interfaces";

// Context
import AuthContext from "../context/auth.context";
import SharecountsContext from "../context/sharecounts.context";

// Components
import Loader from "../components/Common/Loader";
import HeaderThin from "../components/Common/HeaderThin";
import NotLoggedIn from "../components/Common/NotLoggedIn";

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
      (s) => s.id === parseInt(params.sharecountID!)
    );
    if (currentSharecount?.participants?.length) {
      setSharecount(currentSharecount);
      setParticipants(currentSharecount.participants!);
      setIsLoaded(true);
    } else {
      getSharecountService(parseInt(params.sharecountID!)).then(
        (sharecountResponse: ISharecountContext) => {
          currentSharecount = sharecountResponse;
          setSharecount(sharecountResponse);
          setParticipants(sharecountResponse.participants!);
          setIsLoaded(true);
        },
        (error) => {
          console.log(error);
          setError(error);
          setIsLoaded(true);
        }
      );
    }
  }, [params.sharecountID]);

  const save = () => {
    setIsLoaded(false);

    const newSharecount: ISharecountForm = {
      id: parseInt(params.sharecountID!),
      user_email: userEmail!,
      participant_id: value!,
    };

    editSharecountService(newSharecount).then(
      (sharecountResponse: ISharecountContext) => {
        sharecountsContext.find(
          (s) => s.id === parseInt(params.sharecountID!)
        )!.user = sharecountResponse.user;
        navigate("/");
        setIsLoaded(true);
      }
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(event.target.value));
  };

  if (!isLoaded || userLoading) {
    return (
      <div>
        <HeaderThin title={header}></HeaderThin>
        <Loader></Loader>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <HeaderThin
          title={header}
          cancelButton={true}
          onCancel={() => navigate(`/`)}
        ></HeaderThin>
        Please try again later
      </div>
    );
  } else if (!userEmail) {
    return <NotLoggedIn></NotLoggedIn>;
  } else {
    return (
      <div>
        <HeaderThin title={header}></HeaderThin>
        <div className="p-4 flex flex-col">
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Select who you are:
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              {participants
                .sort((a, b) => {
                  if (a.name < b.name) {
                    return -1;
                  }
                  if (a.name > b.name) {
                    return 1;
                  }
                  return 0;
                })
                .map((p: IParticipantsContext) => (
                  <FormControlLabel
                    key={p.id}
                    value={p.id}
                    control={<Radio />}
                    label={p.name}
                  />
                ))}
            </RadioGroup>
          </FormControl>
          <div className="p-4 flex flex-col items-center">
            <Button
              variant="contained"
              sx={{ width: 200, margin: 2 }}
              onClick={() => save()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default SharecountConnect;
