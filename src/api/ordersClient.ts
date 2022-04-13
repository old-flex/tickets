import { AxiosResponse } from "axios";
import apiConfig from "@/api/apiConfig";
import { BusOrderDTO } from "@/models/BusOrderDTO";

export default {
  getUserOrders(): Promise<AxiosResponse<BusOrderDTO[]>> {
    return apiConfig.get(`/v1/orders`);
  },

  getUserTrips(): Promise<AxiosResponse<BusOrderDTO[]>> {
    return apiConfig.get(`/v1/trips`);
  },
};
