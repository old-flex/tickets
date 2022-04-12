import apiConfig from "@/api/apiConfig";
import { AxiosResponse } from "axios";
import { PointDTO } from "@/models/PointDTO";

export default {
  getPointsOfDeparture(pattern?: string): Promise<AxiosResponse<PointDTO[]>> {
    return apiConfig.get(`/v1/points/from`, {
      params: {
        pattern: pattern,
      },
    });
  },

  getPointsOfArrival(
    id: number,
    pattern?: string
  ): Promise<AxiosResponse<PointDTO[]>> {
    return apiConfig.get(`/v1/points/${id}/to`, {
      params: {
        pattern: pattern,
      },
    });
  },
};
