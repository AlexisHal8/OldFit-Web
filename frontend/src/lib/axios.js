import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://backendoldfit-production.up.railway.app/api", // Ajusta el puerto si tu backend usa otro
  withCredentials: true,
});