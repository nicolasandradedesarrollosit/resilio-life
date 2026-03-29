export interface PointsPackageData {
  id: string;
  name: string;
  points: number;
  priceUSD: number;
  priceARS: number;
  exchangeRate: number;
  tier: 'bronze' | 'silver' | 'gold';
}

export interface PackagesResponse {
  success: boolean;
  message: string;
  data: PointsPackageData[];
}

export interface CreatePreferenceResponse {
  success: boolean;
  message: string;
  data: {
    initPoint: string;
    sandboxInitPoint: string;
  };
}
