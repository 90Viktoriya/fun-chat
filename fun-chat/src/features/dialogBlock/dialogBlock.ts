import type Websocket from '../../api/websocket';
import BaseComponent from '../../components/baseComponent';
import { DIALOG_CLASS_NAMES as CLASS_NAMES, ID } from './dialogBlock.constants';
import './dialogBlock.css';
import type { MessageResponse, MessageStatus } from '../../api/websocket.type';
import type { Status, UpdateCountUnread } from './dialogBlock.type';
import { displayStatus, setCountUnread, deleteMessage } from './dialog.Block.helper';

class Dialog {
  connection;

  wrapper;

  header;

  data;

  userLogin;

  usersStatus;

  unreadMessageToThis;

  unreadMessageFromThis;

  userSelected;

  mainPart;

  separateLine;

  sendArea;

  messageInput;

  updateCountUnread;

  constructor(login: string, connection: Websocket, updateCountUnread: UpdateCountUnread) {
    this.connection = connection;
    this.userLogin = login;
    this.updateCountUnread = updateCountUnread;
    this.messageInput = new BaseComponent({
      tag: 'input',
      type: 'text',
      className: `${CLASS_NAMES.messageInput} ${CLASS_NAMES.inputDisable}`,
      required: '1',
      pattern: `(\\s*\\S+\\s*){1,}`,
      placeholder: 'Message...',
      onkeydown: (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.sendMessage();
        }
      }
    });
    this.data = new Map<string, MessageResponse[]>();
    this.usersStatus = new Map<string, boolean>();
    this.unreadMessageToThis = new Map<string, string[]>();
    this.unreadMessageFromThis = new Map<string, string[]>();
    this.userSelected = '';
    this.separateLine = new BaseComponent({
      className: CLASS_NAMES.separateLine,
      textContent: 'New messages',
      id: ID.separateLine
    });
    this.header = new BaseComponent({ className: CLASS_NAMES.header });
    this.mainPart = new BaseComponent(
      {
        className: CLASS_NAMES.mainPart,
        onclick: () => {
          this.markAsRead();
        },
        onwheel: () => {
          this.markAsRead();
        }
      },
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
          this.markAsRead();
        }
      })
    );
    this.wrapper = new BaseComponent({ className: CLASS_NAMES.wrapper }, this.header, this.mainPart, this.sendArea);
  }

  public processMessage(message: MessageResponse) {
    if (message.from === this.userLogin) {
      this.data.set(message.to, this.data.get(message.to)?.concat(message) ?? new Array(message));
      setCountUnread(this.unreadMessageFromThis, message.to, message.id, message.status.isReaded);
    } else {
      this.data.set(message.from, this.data.get(message.from)?.concat(message) ?? new Array(message));
      setCountUnread(this.unreadMessageToThis, message.from, message.id, message.status.isReaded);
    }
  }

  private markAsRead() {
    this.mainPart.removeChild(this.separateLine.node);
    const messages = this.unreadMessageToThis.get(this.userSelected);
    messages?.forEach((item) => {
      this.connection.markRead(item);
    });
    this.unreadMessageToThis.delete(this.userSelected);
    this.updateCountUnread(this.userSelected, 0);
  }

  private showMessage(message: MessageResponse) {
    let className = '';
    let status: Status = '';
    let editedStatus = '';
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
      { className, id: message.id },
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

  private getCountUnread(messages: MessageResponse[]) {
    const result = { login: '', count: 0 };
    if (messages.length > 0) {
      if (messages[0]) {
        if (messages[0]?.from === this.userLogin) {
          result.login = messages[0].to;
        } else {
          result.login = messages[0].from;
        }
      }
      result.count = this.unreadMessageToThis.get(result.login)?.length ?? 0;
    }
    return result;
  }

  public scrollMessages(login: string) {
    if (this.unreadMessageToThis.has(login)) {
      this.separateLine.node.scrollIntoView();
    } else {
      this.mainPart.getLastChildren()?.scrollIntoView(true);
    }
  }

  public getMessage(message: MessageResponse) {
    this.processMessage(message);
    if (message.from === this.userSelected || message.to === this.userSelected) {
      if (this.unreadMessageToThis.get(message.from)?.length === 1) {
        this.mainPart.append(this.separateLine);
      }
      this.showMessage(message);
      this.scrollMessages(message.from);
    }
    return this.getCountUnread(new Array(message));
  }

  public getMessages(messages: MessageResponse[]) {
    messages.forEach((message: MessageResponse) => {
      this.processMessage(message);
    });
    return this.getCountUnread(messages);
  }

  public changeStatus(message: MessageStatus) {
    let login = '';
    let messageIndex = 0;
    this.data.forEach((messages) => {
      messages.forEach((item, index) => {
        if (message.id === item.id) {
          login = item.to;
          messageIndex = index;
        }
      });
    });
    if (login === this.userLogin) {
      return;
    }
    const messages = this.data.get(login);
    if (messages) {
      if (message.status.isReaded) {
        messages[messageIndex]!.status.isReaded = message.status.isReaded;
        deleteMessage(this.unreadMessageFromThis, login, message.id);
      }
      if (message.status.isDelivered) {
        messages[messageIndex]!.status.isDelivered = message.status.isDelivered;
      }
      this.data.set(login, messages);
      if (this.userSelected === login) {
        displayStatus(message);
      }
    }
  }

  private sendMessage() {
    const node = this.messageInput.getNode();
    if (node instanceof HTMLInputElement) {
      this.connection.sendMessageToUser(this.userSelected, node.value);
      node.value = '';
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
          if (index === messages.length - (this.unreadMessageToThis.get(login)?.length ?? 0)) {
            this.mainPart.append(this.separateLine);
          }
          this.showMessage(message);
        });
      }
      this.scrollMessages(login);
    } else {
      this.mainPart.append(new BaseComponent({ textContent: 'Send your first message...' }));
    }
  }

  getDialog() {
    return this.wrapper;
  }
}

export default Dialog;
