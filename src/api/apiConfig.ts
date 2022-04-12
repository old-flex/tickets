import axios from "axios";

const apiConfig = axios.create({
  baseURL: `https://passenger.busbonus.ru`,
  timeout: 60000,
  headers: {
    ContentType: "application/json",
  },
});

export default apiConfig;
