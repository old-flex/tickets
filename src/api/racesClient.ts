import { AxiosResponse } from "axios";
import apiConfig from "@/api/apiConfig";
import { RaceDTO } from "@/models/RaceDTO";
import { RaceSummaryDTO } from "@/models/RaceSummaryDTO";

interface GetRacesRequest {
  from: number;
  to: number;
  date: string;
  count: number;
}

interface SaleDTO {
  birthday: string;
  citizenship: string;
  docNum: string;
  docSeries: string;
  docTypeCode: string;
  firstName: string;
  gender: string;
  lastName: string;
  middleName: string;
  phone: string;
  seatCode: string;
  ticketTypeCode: string;
}

export default {
  getRaces(payload: GetRacesRequest): Promise<AxiosResponse<RaceDTO[]>> {
    return apiConfig.get(`/v1/races`, {
      params: payload,
    });
  },

  getRaceSummary(uid: string): Promise<AxiosResponse<RaceSummaryDTO>> {
    return apiConfig.get(`/v1/races/${uid}/summary`);
  },

  ticketReservation(
    uid: string,
    payload: SaleDTO
  ): Promise<AxiosResponse<{ id: string }>> {
    return apiConfig.post(`/v1/races/${uid}/orders`, payload);
  },
};
