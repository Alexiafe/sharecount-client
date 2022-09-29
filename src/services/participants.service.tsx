// Interfaces & configs
import { serverUrl } from "../constants/config";

export const deleteParticipantsService = (
  participants: string[],
  sharecountID: number
) => {
  return fetch(`${serverUrl}/participants`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      participants: participants,
      sharecount: sharecountID,
    }),
  })
    .then((res) => res.json())
    .then(
      (result) => {
        return result;
      },
      (error) => {
        return error;
      }
    );
};
