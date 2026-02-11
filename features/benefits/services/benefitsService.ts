/**
 * Benefits Service
 * Handles all benefits-related API calls
 */

import { apiClient } from "@/shared/services/apiClient";
import type { BenefitData, BenefitsResponse, BenefitResponse } from "../types/benefits.types";

class BenefitsService {
  /**
   * Get all benefits
   */
  async getAll(): Promise<BenefitsResponse> {
    return apiClient.get<BenefitsResponse>("/benefits");
  }

  /**
   * Get benefit by ID
   */
  async getById(id: string): Promise<BenefitResponse> {
    return apiClient.get<BenefitResponse>(`/benefits/${id}`);
  }

  /**
   * Create new benefit
   * @param formData - FormData containing benefit data and optional image file
   */
  async create(formData: FormData): Promise<BenefitResponse> {
    return apiClient.post<BenefitResponse>("/benefits", formData);
  }

  /**
   * Update existing benefit
   * @param id - Benefit ID
   * @param formData - FormData containing updated benefit data and optional image file
   */
  async update(id: string, formData: FormData): Promise<BenefitResponse> {
    return apiClient.put<BenefitResponse>(`/benefits/${id}`, formData);
  }

  /**
   * Delete benefit
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/benefits/${id}`);
  }
}

export const benefitsService = new BenefitsService();
