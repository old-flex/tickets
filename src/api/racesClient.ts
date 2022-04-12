import { AxiosResponse } from "axios";
import apiConfig from "@/api/apiConfig";
import { RaceDTO } from "@/models/RaceDTO";

interface GetRacesRequest {
  from: number;
  to: number;
  date: string;
  count: number;
}

export default {
  getRaces(payload: GetRacesRequest): Promise<AxiosResponse<RaceDTO[]>> {
    return apiConfig.get(`/v1/races`, {
      params: payload,
    });
  },
};
