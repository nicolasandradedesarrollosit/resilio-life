export interface TransactionUser {
  _id: string;
  name: string;
  lastName: string;
  email: string;
}

export interface TransactionBenefit {
  _id: string;
  title: string;
  pointsCost: number;
}

export interface TransactionData {
  _id: string;
  user: TransactionUser;
  benefit: TransactionBenefit;
  business: string;
  redeemedAt: string;
  createdAt: string;
}
