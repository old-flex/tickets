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
};
