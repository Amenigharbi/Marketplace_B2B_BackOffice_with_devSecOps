import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_SERVICES_API_KEY;
const baseURL = process.env.NEXT_PUBLIC_SERVICES_BASE_URL;

export const servicesClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  },
});
