import { AxiosResponse } from "axios";
import apiConfig from "@/api/apiConfig";
import { BusUserDTO } from "@/models/BusUserDTO";

export default {
  getUserMe(): Promise<AxiosResponse<BusUserDTO>> {
    return apiConfig.get(`/v1/account`);
  },

  editUser(payload: Partial<BusUserDTO>): Promise<AxiosResponse<void>> {
    return apiConfig.put(`/v1/account`, payload);
  },
};
