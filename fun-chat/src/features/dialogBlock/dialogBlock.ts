import type Websocket from '../../api/websocket';
import BaseComponent from '../../components/baseComponent';
import CLASS_NAMES from './dialogBlock.constants';
import './dialogBlock.css';
import type { MessageResponse } from '../../api/websocket.type';
import type { Status } from './dialogBlock.type';

class Dialog {
  connection;

  wrapper;

  header;

  data;

  userLogin;

  usersStatus;

  unreadMessage;

  userSelected;

  mainPart;

  separateLine;

  sendArea;

  messageInput;

  constructor(login: string, connection: Websocket) {
    this.connection = connection;
    this.userLogin = login;
    this.messageInput = new BaseComponent({
      tag: 'input',
      type: 'text',
      className: `${CLASS_NAMES.messageInput} ${CLASS_NAMES.inputDisable}`,
      required: '1',
      placeholder: 'Message...',
      onkeydown: (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.sendMessage();
        }
      }
    });
    this.data = new Map<string, MessageResponse[]>();
    this.usersStatus = new Map<string, boolean>();
    this.unreadMessage = new Map<string, number>();
    this.userSelected = '';
    this.separateLine = new BaseComponent({ className: CLASS_NAMES.separateLine, textContent: 'New messages' });
    this.header = new BaseComponent({ className: CLASS_NAMES.header });
    this.mainPart = new BaseComponent(
      { className: CLASS_NAMES.mainPart },
      new BaseComponent({ textContent: 'Choose user for sending message...' })
    );
    this.sendArea = new BaseComponent(
      { tag: 'form', className: CLASS_NAMES.sendPart },
      this.messageInput,
      new BaseComponent({
        textContent: 'Send',
        className: CLASS_NAMES.button,
        onclick: () => {
          this.sendMessage();
        }
      })
    );
    this.wrapper = new BaseComponent({ className: CLASS_NAMES.wrapper }, this.header, this.mainPart, this.sendArea);
  }

  public processMessage(message: MessageResponse) {
    if (message.from === this.userLogin) {
      this.data.set(message.to, this.data.get(message.to)?.concat(message) ?? new Array(message));
    } else {
      this.data.set(message.from, this.data.get(message.from)?.concat(message) ?? new Array(message));
    }
    if (message.to === this.userLogin && !message.status.isReaded) {
      const value = this.unreadMessage.get(message.from);
      if (value) {
        this.unreadMessage.set(message.from, value + 1);
      } else {
        this.unreadMessage.set(message.from, 1);
      }
    }
  }

  private showMessage(message: MessageResponse) {
    let className = '';
    let status: Status = '';
    let editedStatus = 'fff';
    if (message.status.isEdited) {
      editedStatus = '';
    }
    if (message.from === this.userLogin) {
      if (message.status.isReaded) {
        status = 'read';
      } else if (message.status.isDelivered) {
        status = 'delivered';
      } else {
        status = 'send';
      }
      className = `${CLASS_NAMES.messageWrapper} ${CLASS_NAMES.messageWrapperSelf}`;
    } else {
      className = CLASS_NAMES.messageWrapper;
    }
    const wrapper = new BaseComponent(
      { className },
      new BaseComponent(
        { className: CLASS_NAMES.messageHeader },
        new BaseComponent({ className: CLASS_NAMES.messageHeaderUser, textContent: message.from }),
        new BaseComponent({
          className: CLASS_NAMES.messageHeaderTime,
          textContent: new Date(message.datetime).toLocaleString()
        })
      ),
      new BaseComponent({ className: CLASS_NAMES.messageText, textContent: message.text }),
      new BaseComponent(
        { className: CLASS_NAMES.messageFooter },
        new BaseComponent({ className: CLASS_NAMES.messageEdited, textContent: editedStatus }),
        new BaseComponent({
          className: CLASS_NAMES.messageStatus,
          textContent: status
        })
      )
    );
    this.mainPart.append(wrapper);
  }

  public getMessage(message: MessageResponse) {
    this.processMessage(message);
    if (message.from === this.userSelected || message.to === this.userSelected) {
      this.showMessage(message);
      if (this.unreadMessage.has(message.from)) {
        this.separateLine.node.scrollIntoView();
      } else {
        this.mainPart.getLastChildren()?.scrollIntoView(true);
      }
    }
  }

  public getMessages(messages: MessageResponse[]) {
    messages.forEach((message: MessageResponse) => {
      this.processMessage(message);
    });
    const result = { login: '', count: 0 };
    if (messages.length > 0) {
      if (messages[0]) {
        if (messages[0]?.from === this.userSelected) {
          result.login = messages[0].to;
        } else {
          result.login = messages[0].from;
        }
      }
      result.count = this.unreadMessage.get(result.login) ?? 0;
    }
    return result;
  }

  private sendMessage() {
    const node = this.messageInput.getNode();
    if (node instanceof HTMLInputElement) {
      this.connection.sendMessageToUser(this.userSelected, node.value);
    }
  }

  private loadHeader(login: string) {
    this.header.removeChildren();
    this.header.append(new BaseComponent({ textContent: login }));
    if (this.usersStatus.get(login)) {
      this.header.append(new BaseComponent({ className: CLASS_NAMES.online, textContent: 'online' }));
    } else {
      this.header.append(new BaseComponent({ className: CLASS_NAMES.offline, textContent: 'offline' }));
    }
  }

  public setStatus(login: string, isLogined: boolean) {
    this.usersStatus.set(login, isLogined);
  }

  public updateStatus(login: string, isLogined: boolean) {
    this.usersStatus.set(login, isLogined);
    if (this.userSelected === login) {
      this.loadHeader(login);
    }
  }

  public loadDialog(login: string) {
    this.userSelected = login;
    this.messageInput.removeClass(CLASS_NAMES.inputDisable);
    this.loadHeader(login);
    this.mainPart.removeChildren();
    if (this.data.has(login)) {
      const messages = this.data.get(login);
      if (messages) {
        messages.forEach((message, index) => {
          if (index === messages.length - (this.unreadMessage.get(login) ?? 0)) {
            this.mainPart.append(this.separateLine);
          }
          this.showMessage(message);
        });
      }
      if (this.unreadMessage.has(login)) {
        this.separateLine.node.scrollIntoView();
      }
    } else {
      this.mainPart.append(new BaseComponent({ textContent: 'Send your first message...' }));
    }
  }

  getDialog() {
    return this.wrapper;
  }
}

export default Dialog;
