/**
 * Contact Service
 * Handles contact form submission
 */

import { apiClient } from "@/shared/services/apiClient";
import type { ContactFormData, ContactResponse } from "../types/contact.types";

class ContactService {
  /**
   * Submit contact form
   */
  async submitContactForm(data: ContactFormData): Promise<ContactResponse> {
    return apiClient.post<ContactResponse>("/messages", data);
  }
}

export const contactService = new ContactService();
