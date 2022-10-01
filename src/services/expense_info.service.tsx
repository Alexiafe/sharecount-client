// Interfaces & configs
import { serverUrl } from "../constants/config";

// Interfaces
import { IParticipantForm } from "../interfaces/interfaces";

export const deleteExpenseInfoService = (expense_infos: IParticipantForm[]) => {
  return fetch(`${serverUrl}/expenses_info`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ids: expense_infos.map((e) => e.id),
    }),
  });
};
