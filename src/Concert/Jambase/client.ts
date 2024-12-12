import axios from "axios";

const api = axios.create({
  withCredentials: true,
});
const NODE_API = process.env.REACT_APP_BASE_API;

export const getConcerts = async () => {
  const response = await api.get(
      `${NODE_API}/api/events/jambase`
  );
  return response.data;
};

export const getConcert = async (source: any, eventId: any) => {
  const response = await api.get(
      `${NODE_API}/api/events/${source}/${eventId}`
  );
  return response.data;
};