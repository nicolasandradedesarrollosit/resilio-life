/**
 * Events Type Definitions
 */

export interface EventData {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  url_provider: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  location: string;
  date: string;
  url_provider: string;
  image: File;
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {
  _id: string;
}

export interface EventsResponse {
  message?: string;
  data: EventData[];
}

export interface EventResponse {
  message?: string;
  data: EventData;
}

export interface EventFormFields {
  title: string;
  description: string;
  location: string;
  url_provider: string;
}
