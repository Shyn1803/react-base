import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

export default axios.create({
  baseURL: BASE_URL,
  headers: { "content-type": "application/json" },
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "content-type": "application/json" },
  withCredentials: true,
});
