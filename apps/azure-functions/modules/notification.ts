import axios from "axios";

const TEAMS_INCOMING_WEBHOOK = process.env?.TEAMS_INCOMING_WEBHOOK;

export const sendToTeams = (body) => {
  axios.post(TEAMS_INCOMING_WEBHOOK, body, {});
};

export const sendNotification = (body) => {
  sendToTeams(body);
};
