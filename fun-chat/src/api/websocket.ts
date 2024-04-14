import type { UserData } from '../store/store.types';
import SERVER from './websocket.constants';
import type { Message, WaitingMessages } from './websocket.type';

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
          waiter.callback('OK');
        }
      } else {
        this.messages.push(data);
      }
    };
  }

  private waitResult(id: string, returnMessage: (message: string) => void) {
    this.waiting.push({ id, callback: returnMessage });
  }

  static generateID() {
    const id = crypto.randomUUID();
    return id;
  }

  private sendMessage(type: string, user: UserData, returnMessage: (message: string) => void) {
    const id = Websocket.generateID();
    const msg = {
      id,
      type,
      payload: {
        user: {
          login: user.name,
          password: user.password
        }
      }
    };
    this.connection.send(JSON.stringify(msg));
    this.waitResult(id, returnMessage);
  }

  public logoutUser(user: UserData, returnMessage: (message: string) => void) {
    this.sendMessage('USER_LOGOUT', user, returnMessage);
  }

  public loginUser(user: UserData, returnMessage: (message: string) => void) {
    this.sendMessage('USER_LOGIN', user, returnMessage);
  }
}

const connection = new Websocket();

export default connection;
