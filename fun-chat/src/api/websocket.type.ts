type Error = {
  error: string;
};

type User = {
  login: string;
  isLogined: boolean;
};

export type WaitingMessages = {
  id: string;
  callback: (message: string) => void;
};

export type Message = {
  id: string | null;
  type: string;
  payload: Error | User;
};
