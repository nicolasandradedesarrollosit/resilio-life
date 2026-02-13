/**
 * Benefits Type Definitions
 */

export interface BenefitData {
  _id: string;
  title: string;
  description: string;
  business: string;
  pointsCost: number;
  url_image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBenefitDTO {
  title: string;
  description: string;
  pointsCost: number;
  isActive: boolean;
  image?: File;
}

export interface UpdateBenefitDTO {
  title?: string;
  description?: string;
  pointsCost?: number;
  isActive?: boolean;
  image?: File;
}

export interface BenefitsResponse {
  success?: boolean;
  message?: string;
  data: BenefitData[];
}

export interface BenefitResponse {
  success?: boolean;
  message?: string;
  data: BenefitData;
}
