import axios from "axios";

const api = axios.create({
  withCredentials: true,
});
const NODE_API = process.env.REACT_APP_BASE_API;

export const createUser = async (user: any) => {
  const response = await api.post(
      `${NODE_API}/api/users`,
      user
  );
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get(
      `${NODE_API}/api/users`
  );
  return response.data;
};

export const getUsersByRole = async (role: string) => {
  const response = await api.get(
      `${NODE_API}/api/users?role=${role}`
  );
  return response.data;
}

export const updateUser = async (user: any) => {
  const response = await api.put(
      `${NODE_API}/api/users/${user._id}`,
      user
  );
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(
      `${NODE_API}/api/users/${id}`
  );
  return response.data;
};

export const registerUser = async (user: any) => {
  const response = await api.post(
      `${NODE_API}/api/users/register`,
      user
  );
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const response = await api.post(
      `${NODE_API}/api/users/login`,
      credentials
  );
  return response.data;
};

export const profile = async (userId: string) => {
  const response = await api.post(
      `${NODE_API}/api/users/profile/${userId}`
  );
  return response.data;
};

export const logout = async () => {
  const response = await api.post(
      `${NODE_API}/api/users/logout`
  );
  return response.data;
};
