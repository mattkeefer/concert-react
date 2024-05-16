import axios from "axios";

const api = axios.create({
  withCredentials: true,
});
const NODE_API = process.env.REACT_APP_BASE_API;

export const getExampleConcerts = async () => {
  const response = await api.get(
      `${NODE_API}/api/concerts`
  );
  return response.data;
};

export interface event {
  identifier: string,
  performer: [{ name: string }],
  location: {
    name: string,
    address: {
      addressLocality: string,
      addressRegion: {
        alternateName: string,
      },
    },
  },
  startDate: string,
  image: string,
}