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
    isDelivered?: boolean;
    isReaded?: boolean;
    isEdited?: boolean;
    isDeleted?: boolean;
  };
};

export type MessageStatus = Pick<MessageResponse, 'id' | 'status'>;
export type MessageChanged = Pick<MessageResponse, 'id' | 'text' | 'status'>;
export type MessageStatusRequest = {
  id: string;
};

export type ReturnResult = (message: string) => void;
export type ReturnMessage = (message: MessageResponse) => void;
export type ReturnMessages = (messages: MessageResponse[]) => void;
export type ChangeStatus = (message: MessageStatus) => void;
export type ChangeMessage = (message: MessageChanged) => void;
export type DeleteMessage = (id: string) => void;

export type WaitingMessages = {
  id: string;
  callback: ReturnResult;
};

export type Callbacks = {
  loginLogoutCallback: (user: UserResponse) => void;
  returnMessages: ReturnMessages;
  returnMessage: ReturnMessage;
  changeStatus: ChangeStatus;
  changeMessage: ChangeMessage;
  deleteMessage: DeleteMessage;
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
  message?: MessageRequest | MessageStatusRequest;
} | null;

export type Message = {
  id: string | null;
  type: string;
  payload: PayloadResponse;
};
