// Interfaces
import { ISharecountContext, IParticipantsContext } from "../interfaces/interfaces";

// MUI
import { List, ListItemButton, ListItemText, Typography } from "@mui/material";

interface IPropsBalanceList {
  sharecount?: ISharecountContext;
}

const BalanceList = (props: IPropsBalanceList) => {
  const participants = props.sharecount?.participants?.sort(function (
    a: IParticipantsContext,
    b: IParticipantsContext
  ) {
    return a.balance - b.balance;
  });

  return (
    <ul>
      {participants?.map((p: IParticipantsContext) => (
        <li key={p.id}>
          <List disablePadding>
            <ListItemButton>
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
                  p.balance === 0 ? (
                    <Typography sx={{ fontSize: "20px" }}>
                      {p.balance.toFixed(2)}
                    </Typography>
                  ) : p.balance > 0 ? (
                    <Typography sx={{ color: "green", fontSize: "20px" }}>
                      {`+${p.balance.toFixed(2)}`}
                    </Typography>
                  ) : (
                    <Typography sx={{ color: "#E53935", fontSize: "20px" }}>
                      {p.balance.toFixed(2)}
                    </Typography>
                  )
                }
              />
            </ListItemButton>
          </List>
        </li>
      ))}
    </ul>
  );
};

export default BalanceList;
