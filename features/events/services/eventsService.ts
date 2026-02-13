/**
 * Events Service
 * Handles all events-related API calls
 */

import { apiClient } from "@/shared/services/apiClient";
import type { EventsResponse, EventResponse } from "../types/events.types";

class EventsService {
  /**
   * Get all events
   */
  async getAll(): Promise<EventsResponse> {
    return apiClient.get<EventsResponse>("/events");
  }

  /**
   * Get event by ID
   */
  async getById(id: string): Promise<EventResponse> {
    return apiClient.get<EventResponse>(`/events/${id}`);
  }

  /**
   * Create new event
   * @param formData - FormData containing event data and image file
   */
  async create(formData: FormData): Promise<EventResponse> {
    return apiClient.post<EventResponse>("/events", formData);
  }

  /**
   * Update existing event
   * @param id - Event ID
   * @param formData - FormData containing updated event data and optional image file
   */
  async update(id: string, formData: FormData): Promise<EventResponse> {
    return apiClient.patch<EventResponse>(`/events/${id}`, formData);
  }

  /**
   * Delete event
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/events/${id}`);
  }
}

export const eventsService = new EventsService();
