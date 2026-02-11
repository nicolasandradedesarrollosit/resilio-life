/**
 * Benefits Type Definitions
 */

export interface BenefitData {
  _id: string;
  title: string;
  description: string;
  discount: string;
  businessName: string;
  location: string;
  url_provider?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBenefitDTO {
  title: string;
  description: string;
  discount: string;
  businessName: string;
  location: string;
  url_provider?: string;
  image?: File;
}

export interface UpdateBenefitDTO extends Partial<CreateBenefitDTO> {
  _id: string;
}

export interface BenefitsResponse {
  message?: string;
  data: BenefitData[];
}

export interface BenefitResponse {
  message?: string;
  data: BenefitData;
}

export interface BenefitFormFields {
  title: string;
  description: string;
  discount: string;
  businessName: string;
  location: string;
  url_provider: string;
}
