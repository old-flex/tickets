import apiConfig from "@/api/apiConfig";
import { AxiosResponse } from "axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export default {
  login(
    payload: LoginRequest
  ): Promise<AxiosResponse<{ access_token: string }>> {
    return apiConfig.post(`/login`, payload);
  },

  restorePassword(phone: string): Promise<AxiosResponse<void>> {
    return apiConfig.post(`/v1/users`, { phone: phone });
  },
};
