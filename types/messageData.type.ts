export interface MessageData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  origin: string;
}

export interface MessageState {
  messages: MessageData[];
  loading: boolean;
  loaded: boolean;
}

export interface MessageResponse {
  data: MessageData[];
}
