import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const register = (data) => axios.post(`${API_URL}/auth/register`, data);
export const login = (data) => axios.post(`${API_URL}/auth/login`, data);
export const searchUsers = (search) =>
  axios.get(`${API_URL}/users?search=${search}`);
export const accessChat = (userId) =>
  axios.post(`${API_URL}/chats`, { userId });
