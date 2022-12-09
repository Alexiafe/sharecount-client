// Interfaces
import { IParticipantResponse } from "../interfaces/interfaces";

// Components
import Loader from "./Loader";

// Services
import { getSharecountService } from "../services/sharecount.service";

// React
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// MUI
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const BalanceList = () => {
  const params = useParams();
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [participants, setParticipants] = useState<IParticipantResponse[]>([]);

  useEffect(() => {
    getSharecountService(parseInt(params.sharecountID!)).then(
      (sharecount) => {
        setIsLoaded(true);
        setParticipants(
          sharecount.participants.sort(function (
            a: IParticipantResponse,
            b: IParticipantResponse
          ) {
            return a.balance - b.balance;
          })
        );
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [params.sharecountID]);

  const balanceslist = participants.map((p: IParticipantResponse) => (
    <li key={p.id}>
      <List disablePadding>
        <ListItem button>
          <ListItemText
            primaryTypographyProps={{
              variant: "h6",
            }}
            primary={p.name}
          />
          <ListItemText
            style={{
              textAlign: "right",
            }}
            primary={
              p.balance > 0 ? (
                <Typography
                  sx={{ color: "green", fontSize: "20px" }}
                >{`+${p.balance.toFixed(2)}`}</Typography>
              ) : (
                <Typography sx={{ color: "red", fontSize: "20px" }}>
                  {p.balance.toFixed(2)}
                </Typography>
              )
            }
          />
        </ListItem>
      </List>
    </li>
  ));

  if (error) {
    return <div>Please try again later</div>;
  } else if (!isLoaded) {
    return (
      <div>
        <Loader></Loader>
      </div>
    );
  } else {
    return <ul>{balanceslist}</ul>;
  }
};

export default BalanceList;
