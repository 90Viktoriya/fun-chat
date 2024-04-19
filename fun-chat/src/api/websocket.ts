import type { UserData } from '../store/store.types';
import SERVER from './websocket.constants';
import type { Message, PayloadRequest, WaitingMessages, ReturnResult, UserResponse, Callbacks } from './websocket.type';

class Websocket {
  connection: WebSocket;

  errorCallback;

  loginLogoutCallback: (user: UserResponse) => void;

  returnMessages: (messages: string) => void;

  messages: Message[];

  waiting: WaitingMessages[];

  public openStatus;

  constructor(errorCallback: () => void) {
    this.errorCallback = errorCallback;
    this.loginLogoutCallback = () => {};
    this.returnMessages = () => {};
    this.connection = new WebSocket(SERVER);
    this.openStatus = false;
    this.messages = [];
    this.waiting = [];
    this.addListeners();
  }

  private processMessage(data: Message) {
    if (data.type === 'USER_EXTERNAL_LOGOUT' || data.type === 'USER_EXTERNAL_LOGIN') {
      if (data.payload.user) {
        this.loginLogoutCallback(data.payload.user);
      }
    }
    this.messages.push(data);
  }

  private addListeners() {
    this.connection.onopen = () => {
      this.openStatus = true;
    };

    this.connection.onerror = () => {
      this.errorCallback();
    };

    this.connection.onclose = () => {
      this.reconnect();
    };

    this.connection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const waiter = this.waiting.find((element) => element.id === data.id);
      if (waiter) {
        if (data.type === 'ERROR') {
          waiter.callback(data.payload.error);
        } else {
          if (data.type === 'USER_ACTIVE' || data.type === 'USER_INACTIVE') {
            this.getMessages(data.payload.users);
          }
          waiter.callback('OK', JSON.stringify(data.payload));
        }
      } else {
        this.processMessage(data);
      }
    };
  }

  public setCallbacks(callbacks: Callbacks) {
    this.loginLogoutCallback = callbacks.loginLogoutCallback;
    this.returnMessages = callbacks.returnMessages;
  }

  private waitResult(id: string, returnMessage: ReturnResult) {
    this.waiting.push({ id, callback: returnMessage });
  }

  static generateID() {
    const id = crypto.randomUUID();
    return id;
  }

  private reconnect() {
    setTimeout(() => {
      this.connection = new WebSocket(SERVER);
      this.openStatus = false;
      this.messages = [];
      this.waiting = [];
      this.addListeners();
    }, 1000);
  }

  private sendMessage(type: string, payload: PayloadRequest, returnMessage: ReturnResult) {
    if (!this.openStatus) {
      return;
    }
    const id = Websocket.generateID();
    const msg = {
      id,
      type,
      payload
    };
    this.connection.send(JSON.stringify(msg));
    this.waitResult(id, returnMessage);
  }

  public logoutUser(user: UserData, returnMessage: ReturnResult) {
    const payload = {
      user: {
        login: user.name,
        password: user.password
      }
    };
    this.sendMessage('USER_LOGOUT', payload, returnMessage);
  }

  public loginUser(user: UserData, returnMessage: ReturnResult) {
    const payload = {
      user: {
        login: user.name,
        password: user.password
      }
    };
    this.sendMessage('USER_LOGIN', payload, returnMessage);
  }

  public getUsers(returnUsers: ReturnResult) {
    this.sendMessage('USER_ACTIVE', null, returnUsers);
    this.sendMessage('USER_INACTIVE', null, returnUsers);
  }

  public getMessages(users: UserResponse[]) {
    users.forEach((item) => {
      const payload = {
        user: {
          login: item.login
        }
      };
      this.sendMessage('MSG_FROM_USER', payload, this.returnMessages);
    });
  }
}

export default Websocket;
