/**
 * Benefits Service
 * Handles all benefits-related API calls
 */

import { apiClient } from "@/shared/services/apiClient";
import type { BenefitsResponse, BenefitResponse } from "../types/benefits.types";

class BenefitsService {
  async getAll(): Promise<BenefitsResponse> {
    return apiClient.get<BenefitsResponse>("/benefits");
  }

  async getById(id: string): Promise<BenefitResponse> {
    return apiClient.get<BenefitResponse>(`/benefits/${id}`);
  }

  async create(formData: FormData): Promise<BenefitResponse> {
    return apiClient.post<BenefitResponse>("/benefits", formData);
  }

  async update(id: string, formData: FormData): Promise<BenefitResponse> {
    return apiClient.patch<BenefitResponse>(`/benefits/${id}`, formData);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/benefits/${id}`);
  }
}

export const benefitsService = new BenefitsService();
