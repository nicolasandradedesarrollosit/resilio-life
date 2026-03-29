import type {
  PackagesResponse,
  CreatePreferenceResponse,
} from "../types/payments.types";

import { apiClient } from "@/shared/services/apiClient";

class PaymentsService {
  async getPackages(): Promise<PackagesResponse> {
    return apiClient.get<PackagesResponse>("/payments/packages");
  }

  async createPreference(packageId: string): Promise<CreatePreferenceResponse> {
    return apiClient.post<CreatePreferenceResponse>(
      "/payments/create-preference",
      { packageId }
    );
  }
}

export const paymentsService = new PaymentsService();
