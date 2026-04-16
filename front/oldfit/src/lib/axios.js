import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api", // Ajusta el puerto si tu backend usa otro
  withCredentials: true,
});