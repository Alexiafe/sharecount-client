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
  const errorMissingPartakers = props.errorMissingPartakers;
  const selectedParticipantsIDs = props.selectedParticipantsIDs;
  const participants = props.participants;
  const selectAll = props.selectAll;
  const onHandleCheckAll = props.onHandleCheckAll;
  const onHandleCheckChange = props.onHandleCheckAll;

  return (
    <div className="py-2">
      From whom:
      <div className="text-xs text-red-600">{errorMissingPartakers}</div>
      <Checkbox
        checked={
          selectedParticipantsIDs.length === participants.length || selectAll
        }
        onChange={onHandleCheckAll}
        style={{ width: "20px", padding: 0 }}
      />
      <ul>
        {participants.map((p: IParticipantsContext) => (
          <li key={p.id}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    value={p.id}
                    checked={
                      selectAll ? true : selectedParticipantsIDs.includes(p.id)
                    }
                    onChange={onHandleCheckChange}
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
