/**
 * Headquarters Type Definitions
 */

export interface HeadquarterData {
  _id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHeadquarterDTO {
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  description?: string;
}

export interface UpdateHeadquarterDTO extends Partial<CreateHeadquarterDTO> {
  _id: string;
}

export interface HeadquartersResponse {
  message?: string;
  data: HeadquarterData[];
}

export interface HeadquarterResponse {
  message?: string;
  data: HeadquarterData;
}

export interface HeadquarterFormFields {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  description: string;
}
