import axios from "axios";

const axiosWithCredentials = axios.create({
  withCredentials: true,
});
const NODE_API = process.env.REACT_APP_BASE_API;

export const interestConcert = async (concert: any) => {
  const response = await axiosWithCredentials.post(
      `${NODE_API}/api/likes/interested`,
      concert
  );
  return response.data;
}

export const attendConcert = async (concert: any) => {
  const response = await axiosWithCredentials.post(
      `${NODE_API}/api/likes/attending`,
      concert
  );
  return response.data;
}

export const removeInterest = async (concertId: any) => {
  const [source, id] = concertId.split(":");
  const response = await axiosWithCredentials.delete(
      `${NODE_API}/api/likes/interested/${source}/${id}`);
  return response.data;
}

export const removeAttending = async (concertId: any) => {
  const [source, id] = concertId.split(":");
  const response = await axiosWithCredentials.delete(
      `${NODE_API}/api/likes/attending/${source}/${id}`);
  return response.data;
}

export const getAllInterested = async () => {
  const response = await axiosWithCredentials.get(
      `${NODE_API}/api/likes/interested`
  );
  return response.data;
}

export const getAllAttending = async () => {
  const response = await axiosWithCredentials.get(
      `${NODE_API}/api/likes/attending`
  );
  return response.data;
}

export const followUser = async (userId: any) => {
  const response = await axiosWithCredentials.post(
      `${NODE_API}/api/social/follow/${userId}`
  );
  return response.data;
}

export const unfollowUser = async (userId: any) => {
  const response = await axiosWithCredentials.delete(
      `${NODE_API}/api/social/follow/${userId}`
  );
  return response.data;
}

export const getAllFollowing = async (userId: any) => {
  const response = await axiosWithCredentials.get(
      `${NODE_API}/api/social/following/${userId}`
  );
  return response.data;
}

export const getAllFollowers = async (userId: any) => {
  const response = await axiosWithCredentials.get(
      `${NODE_API}/api/social/followers/${userId}`
  );
  return response.data;
}