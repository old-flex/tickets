import { AxiosResponse } from "axios";
import apiConfig from "@/api/apiConfig";

interface PaymentUrlRequest {
  orderIds: number[];
  paymentTypeId: number;
}

export default {
  getPaymentUrl(
    payload: PaymentUrlRequest
  ): Promise<AxiosResponse<{ url: string }>> {
    return apiConfig.post(`/v1/payments`, payload);
  },
};
