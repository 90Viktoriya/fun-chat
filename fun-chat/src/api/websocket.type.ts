export type UserResponse = {
  login: string;
  isLogined: boolean;
};

export type UserRequest = {
  login: string;
  password?: string;
};

export type MessageRequest = {
  to: string;
  text: string;
};

export type MessageResponse = {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
};

export type ReturnResult = (message: string) => void;
export type ReturnMessage = (message: MessageResponse) => void;
export type ReturnMessages = (messages: MessageResponse[]) => void;

export type WaitingMessages = {
  id: string;
  callback: ReturnResult;
};

export type Callbacks = {
  loginLogoutCallback: (user: UserResponse) => void;
  returnMessages: ReturnMessages;
  returnMessage: ReturnMessage;
};

export type PayloadResponse = {
  user?: UserResponse;
  error?: string;
  users?: UserResponse[];
  message?: MessageResponse;
  messages?: MessageResponse[];
};

export type PayloadRequest = {
  user?: UserRequest;
  message?: MessageRequest;
} | null;

export type Message = {
  id: string | null;
  type: string;
  payload: PayloadResponse;
};
