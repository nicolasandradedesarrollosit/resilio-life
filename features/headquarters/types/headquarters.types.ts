/**
 * Headquarters Type Definitions
 */

export interface HeadquarterData {
  _id: string;
  name: string;
  coordinates: number[];
  business: string;
}

export interface CreateHeadquarterDTO {
  name: string;
  coordinates: [number, number];
}

export interface UpdateHeadquarterDTO {
  name?: string;
  coordinates?: [number, number];
}

export interface HeadquartersResponse {
  success?: boolean;
  message?: string;
  data: HeadquarterData[];
}

export interface HeadquarterResponse {
  success?: boolean;
  message?: string;
  data: HeadquarterData;
}
