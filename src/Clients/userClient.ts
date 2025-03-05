import axios from "axios";
import {User, UserSearchParams} from "./Schemas/users";

const api = axios.create({
  withCredentials: true,
});
const NODE_API = process.env.REACT_APP_BASE_API;

export const createUser = async (user: User) => {
  const response = await api.post(
      `${NODE_API}/users`,
      user
  );
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await api.get(
      `${NODE_API}/users/${userId}`
  );
  return response.data;
};

export const getSavedConcertsForUserById = async (userId: string) => {
  const response = await api.get(
      `${NODE_API}/users/${userId}/concerts`
  );
  return response.data;
}

export const getUserByUsername = async (username: string) => {
  const response = await api.get(
      `${NODE_API}/users/username/${username}`
  );
  return response.data;
};

export const getUsersByQuery = async (searchParams: UserSearchParams) => {
  const res = await api.get(`${NODE_API}/users`, {params: searchParams});
  return res.data;
}

export const updateUser = async (user: User) => {
  const response = await api.put(
      `${NODE_API}/users/${user._id}`,
      user
  );
  return response.data;
};

export const saveConcert = async (userId: string, concertId: string, token: string) => {
  const response = await api.post(
      `${NODE_API}/users/${userId}/save-concert/${concertId}`,
      {}, {headers: {'Authorization': `Bearer ${token}`}}
  );
  return response.data;
};

export const unsaveConcert = async (userId: string, concertId: string, token: string) => {
  const response = await api.post(
      `${NODE_API}/users/${userId}/unsave-concert/${concertId}`,
      {}, {headers: {'Authorization': `Bearer ${token}`}}
  );
  return response.data;
};

export const followUser = async (userId: string, targetUserId: string, token: string) => {
  const response = await api.post(
      `${NODE_API}/users/${userId}/follow/${targetUserId}`,
      {}, {headers: {'Authorization': `Bearer ${token}`}}
  );
  return response.data;
};

export const unfollowUser = async (userId: string, targetUserId: string, token: string) => {
  const response = await api.post(
      `${NODE_API}/users/${userId}/unfollow/${targetUserId}`,
      {}, {headers: {'Authorization': `Bearer ${token}`}}
  );
  return response.data;
};

export const registerUser = async (userData: {
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string,
}) => {
  const response = await api.post(
      `${NODE_API}/users/register`,
      userData
  );
  return response.data;
};

export const loginUser = async (credentials: { email: string, password: string }) => {
  const response = await api.post(
      `${NODE_API}/users/login`,
      credentials
  );
  return response.data;
};

export const profile = async (userId: string, token: string) => {
  const response = await api.post(
      `${NODE_API}/users/profile/${userId}`,
      {}, {headers: {'Authorization': `Bearer ${token}`}}
  );
  return response.data;
};
