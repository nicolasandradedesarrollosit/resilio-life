/**
 * Headquarters Service
 * Handles all headquarters-related API calls
 */

import { apiClient } from "@/shared/services/apiClient";
import type {
  HeadquarterData,
  HeadquartersResponse,
  HeadquarterResponse,
  CreateHeadquarterDTO,
  UpdateHeadquarterDTO,
} from "../types/headquarters.types";

class HeadquartersService {
  /**
   * Get all headquarters
   */
  async getAll(): Promise<HeadquartersResponse> {
    return apiClient.get<HeadquartersResponse>("/headquarters");
  }

  /**
   * Get headquarter by ID
   */
  async getById(id: string): Promise<HeadquarterResponse> {
    return apiClient.get<HeadquarterResponse>(`/headquarters/${id}`);
  }

  /**
   * Create new headquarter
   */
  async create(data: CreateHeadquarterDTO): Promise<HeadquarterResponse> {
    return apiClient.post<HeadquarterResponse>("/headquarters", data);
  }

  /**
   * Update existing headquarter
   */
  async update(
    id: string,
    data: UpdateHeadquarterDTO
  ): Promise<HeadquarterResponse> {
    return apiClient.put<HeadquarterResponse>(`/headquarters/${id}`, data);
  }

  /**
   * Delete headquarter
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/headquarters/${id}`);
  }
}

export const headquartersService = new HeadquartersService();
