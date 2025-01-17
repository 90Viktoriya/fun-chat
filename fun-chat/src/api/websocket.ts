import type { UserData } from '../store/store.types';
import SERVER from './websocket.constants';
import type {
  Message,
  PayloadRequest,
  WaitingMessages,
  ReturnResult,
  UserResponse,
  Callbacks,
  ReturnMessage,
  ReturnMessages,
  ChangeStatus,
  DeleteMessage,
  ChangeMessage
} from './websocket.type';

class Websocket {
  connection: WebSocket;

  errorCallback;

  loginLogoutCallback: (user: UserResponse) => void;

  returnMessages: ReturnMessages;

  returnMessage: ReturnMessage;

  changeStatus: ChangeStatus;

  deleteMessageCallback: DeleteMessage;

  changeMessage: ChangeMessage;

  waiting: WaitingMessages[];

  public openStatus;

  constructor(errorCallback: () => void) {
    this.errorCallback = errorCallback;
    this.loginLogoutCallback = () => {};
    this.returnMessages = () => {};
    this.returnMessage = () => {};
    this.changeStatus = () => {};
    this.deleteMessageCallback = () => {};
    this.changeMessage = () => {};
    this.connection = new WebSocket(SERVER);
    this.openStatus = false;
    this.waiting = [];
    this.addListeners();
  }

  private processWaitingMessage(waiter: WaitingMessages, data: Message) {
    if (data.type === 'ERROR') {
      if (data.payload.error) {
        waiter.callback(data.payload.error ?? '');
      }
    } else {
      if (data.type === 'USER_ACTIVE' || data.type === 'USER_INACTIVE') {
        if (data.payload.users) {
          this.getMessages(data.payload.users);
        }
      }
      if (data.type === 'USER_LOGIN' || data.type === 'USER_LOGOUT') {
        waiter.callback('OK');
        return;
      }
      waiter.callback(JSON.stringify(data.payload));
    }
  }

  private processMessage(data: Message) {
    if (data.type === 'USER_EXTERNAL_LOGOUT' || data.type === 'USER_EXTERNAL_LOGIN') {
      if (data.payload.user) {
        this.loginLogoutCallback(data.payload.user);
        return;
      }
    }
    if (data.type === 'MSG_SEND') {
      if (data.payload.message) {
        this.returnMessage(data.payload.message);
        return;
      }
    }
    if (data.type === 'MSG_FROM_USER') {
      if (data.payload.messages) {
        this.returnMessages(data.payload.messages);
        return;
      }
    }
    if (data.type === 'MSG_DELIVER' || data.type === 'MSG_READ') {
      if (data.payload.message) {
        this.changeStatus(data.payload.message);
      }
    }
    if (data.type === 'MSG_EDIT') {
      if (data.payload.message) {
        this.changeMessage(data.payload.message);
      }
    }
    if (data.type === 'MSG_DELETE') {
      if (data.payload.message) {
        if (data.payload.message.status.isDeleted) {
          this.deleteMessageCallback(data.payload.message.id);
        }
      }
    }
  }

  public markRead(id: string) {
    const payload = {
      message: {
        id
      }
    };
    this.sendMessage('MSG_READ', payload);
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
        this.processWaitingMessage(waiter, data);
      } else {
        this.processMessage(data);
      }
    };
  }

  public setCallbacks(callbacks: Callbacks) {
    this.loginLogoutCallback = callbacks.loginLogoutCallback;
    this.returnMessages = callbacks.returnMessages;
    this.returnMessage = callbacks.returnMessage;
    this.changeStatus = callbacks.changeStatus;
    this.changeMessage = callbacks.changeMessage;
    this.deleteMessageCallback = callbacks.deleteMessage;
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
      this.waiting = [];
      this.addListeners();
    }, 1000);
  }

  private sendMessage(type: string, payload: PayloadRequest, returnMessage?: ReturnResult) {
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
    if (returnMessage) {
      this.waitResult(id, returnMessage);
    }
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
      this.sendMessage('MSG_FROM_USER', payload);
    });
  }

  public sendMessageToUser(login: string, text: string) {
    const payload = {
      message: {
        to: login,
        text
      }
    };
    this.sendMessage('MSG_SEND', payload);
  }

  public editMessage(id: string, text: string) {
    const payload = {
      message: {
        id,
        text
      }
    };
    this.sendMessage('MSG_EDIT', payload);
  }

  public deleteMessage(id: string) {
    const payload = {
      message: {
        id
      }
    };
    this.sendMessage('MSG_DELETE', payload);
  }
}

export default Websocket;
