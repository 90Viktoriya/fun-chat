import type { UserData } from '../store/store.types';
import SERVER from './websocket.constants';
import type { Message, PayloadRequest, WaitingMessages, ReturnResult } from './websocket.type';

class Websocket {
  connection: WebSocket;

  messages: Message[];

  waiting: WaitingMessages[];

  public openStatus;

  constructor() {
    this.connection = new WebSocket(SERVER);
    this.openStatus = false;
    this.messages = [];
    this.waiting = [];
    this.connection.onopen = () => {
      this.openStatus = true;
      console.log('WebSocket connection established.');
    };

    this.connection.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.connection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const waiter = this.waiting.find((element) => element.id === data.id);
      if (waiter) {
        if (data.type === 'ERROR') {
          waiter.callback(data.payload.error);
        } else {
          waiter.callback('OK', JSON.stringify(data.payload));
        }
      } else {
        this.messages.push(data);
      }
    };
  }

  private waitResult(id: string, returnMessage: ReturnResult) {
    this.waiting.push({ id, callback: returnMessage });
  }

  static generateID() {
    const id = crypto.randomUUID();
    return id;
  }

  private sendMessage(type: string, payload: PayloadRequest, returnMessage: ReturnResult) {
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
}

const connection = new Websocket();

export default connection;
