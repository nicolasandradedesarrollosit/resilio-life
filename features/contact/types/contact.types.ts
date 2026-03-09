/**
 * Contact Type Definitions
 */

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  message?: string;
  data?: any;
  success: boolean;
}
