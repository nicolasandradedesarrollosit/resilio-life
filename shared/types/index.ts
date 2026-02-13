// Generic API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export type { UserData, UserDataState } from "./user.types";
export type { EventData } from "./event.types";
export type {
  MessageData,
  MessageState,
  MessageResponse,
} from "./message.types";
export type { HeadquartersData } from "./headquarters.types";
export type { BenefitData } from "./benefit.types";
export type {
  TransactionData,
  TransactionUser,
  TransactionBenefit,
} from "./transaction.types";
