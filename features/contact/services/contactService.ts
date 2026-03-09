/**
 * Contact Service
 * Handles contact form submission
 */

import type { ContactFormData, ContactResponse } from "../types/contact.types";

import { apiClient } from "@/shared/services/apiClient";

class ContactService {
  /**
   * Submit contact form
   */
  async submitContactForm(data: ContactFormData): Promise<ContactResponse> {
    return apiClient.post<ContactResponse>("/messages", data);
  }
}

export const contactService = new ContactService();
