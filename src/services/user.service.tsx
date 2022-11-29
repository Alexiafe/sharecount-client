// Interfaces & configs
import { serverUrl } from "../constants/config";

export const getUserService = (userEmail: string) => {
  return fetch(`${serverUrl}/user/${userEmail}`)
    .then((res) => {
      return res.text();
    })
    .then((data) => {
      return data ? JSON.parse(data) : null;
    })
    .then(
      (user) => {
        return user;
      },
      (error) => {
        return error;
      }
    );
};

export const addUserService = (userEmail: string) => {
  return fetch(`${serverUrl}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: userEmail }),
  })
    .then((res) => res.json())
    .then(
      (user) => {
        return user;
      },
      (error) => {
        return error;
      }
    );
};
