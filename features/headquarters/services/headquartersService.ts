/**
 * Headquarters Service
 * Handles all headquarters-related API calls
 */

import type {
  HeadquartersResponse,
  HeadquarterResponse,
  CreateHeadquarterDTO,
  UpdateHeadquarterDTO,
} from "../types/headquarters.types";

import { apiClient } from "@/shared/services/apiClient";

class HeadquartersService {
  async getAll(): Promise<HeadquartersResponse> {
    return apiClient.get<HeadquartersResponse>("/headquarters");
  }

  async getById(id: string): Promise<HeadquarterResponse> {
    return apiClient.get<HeadquarterResponse>(`/headquarters/${id}`);
  }

  async create(data: CreateHeadquarterDTO): Promise<HeadquarterResponse> {
    return apiClient.post<HeadquarterResponse>("/headquarters", data);
  }

  async update(
    id: string,
    data: UpdateHeadquarterDTO,
  ): Promise<HeadquarterResponse> {
    return apiClient.patch<HeadquarterResponse>(`/headquarters/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/headquarters/${id}`);
  }
}

export const headquartersService = new HeadquartersService();
