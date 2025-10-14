import axios from "axios";

const token = process.env.NEXT_PUBLIC_MAGENTO_TOKEN;
const baseURL = process.env.NEXT_PUBLIC_MAGENTO_URL;

export const magentoClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
