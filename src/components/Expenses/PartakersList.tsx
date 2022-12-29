// Interfaces
import { IParticipantsContext } from "../../interfaces/interfaces";

// MUI
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

interface IPropsPartakersList {
  errorMissingPartakers: string;
  selectedParticipantsIDs: number[];
  participants: IParticipantsContext[];
  selectAll: boolean;
  onHandleCheckAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onHandleCheckChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PartakersList = (props: IPropsPartakersList) => {
  return (
    <div className="py-2">
      From whom:
      <div className="text-xs text-red-600">{props.errorMissingPartakers}</div>
      <Checkbox
        checked={
          props.selectedParticipantsIDs.length === props.participants.length ||
          props.selectAll
        }
        onChange={props.onHandleCheckAll}
        style={{ width: "20px", padding: 0 }}
      />
      <ul>
        {props.participants.map((p: IParticipantsContext) => (
          <li key={p.id}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    value={p.id}
                    checked={
                      props.selectAll
                        ? true
                        : props.selectedParticipantsIDs.includes(p.id)
                    }
                    onChange={props.onHandleCheckChange}
                  />
                }
                label={p.name}
              />
            </FormGroup>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartakersList;
