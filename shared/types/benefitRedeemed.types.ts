export interface CatalogBenefitData {
  _id: string;
  title: string;
  description: string;
  business: {
    _id: string;
    businessName: string;
    businessImageURL?: string;
    businessCategory?: string;
  };
  pointsCost: number;
  url_image: string;
  isActive: boolean;
  createdAt: string;
}

export interface RedeemedBenefitData {
  _id: string;
  user: string;
  benefit: {
    _id: string;
    title: string;
    description: string;
    url_image: string;
    pointsCost: number;
  };
  business: {
    _id: string;
    businessName: string;
  };
  pointsSpent: number;
  redeemedAt: string;
}

export interface MapLocationData {
  _id: string;
  name: string;
  coordinates: number[];
  business: {
    _id: string;
    businessName: string;
    businessImageURL?: string;
    businessCategory?: string;
  };
  activeBenefitCount: number;
}
