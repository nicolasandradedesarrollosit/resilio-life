/**
 * Events Type Definitions
 */

export interface EventData {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  url_image: string;
  url_provider: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventsResponse {
  success?: boolean;
  message?: string;
  data: EventData[];
}

export interface EventResponse {
  success?: boolean;
  message?: string;
  data: EventData;
}

export interface EventFormFields {
  title: string;
  description: string;
  location: string;
  url_provider: string;
}
