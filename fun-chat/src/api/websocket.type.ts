export type UserResponse = {
  login: string;
  isLogined: boolean;
};

export type UserRequest = {
  login: string;
  password: string;
};

export type ReturnResult = (message: string, result?: string) => void;

export type WaitingMessages = {
  id: string;
  callback: ReturnResult;
};

export type PayloadResponse = {
  user?: UserResponse;
  error?: string;
};

export type PayloadRequest = {
  user?: UserRequest;
} | null;

export type Message = {
  id: string | null;
  type: string;
  payload: PayloadResponse;
};
