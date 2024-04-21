import { ID } from './dialogBlock.constants';
import type { MessageStatus } from '../../api/websocket.type';
import type { MessageMap } from './dialogBlock.type';

export function displayStatus(message: MessageStatus) {
  const messageElement = document.getElementById(message.id);
  const footer = messageElement?.children.item(ID.footer);
  const statusElement = footer?.children.item(ID.deliveredStatus);
  if (!(statusElement instanceof HTMLElement)) {
    return;
  }
  if (message.status.isReaded) {
    statusElement.textContent = 'read';
    return;
  }
  statusElement.textContent = 'delivered';
}

export function setCountUnread(array: MessageMap, user: string, id: string, status: boolean | undefined) {
  if (status) {
    return;
  }
  const value = array.get(user);
  if (value) {
    value.push(id);
    array.set(user, value);
  } else {
    array.set(user, new Array(id));
  }
}

export function deleteMessage(array: MessageMap, login: string, id: string) {
  let messages = array.get(login);
  messages = messages?.splice(messages.indexOf(id), 1);
  if (messages) {
    array.set(login, messages);
  } else {
    array.delete(login);
  }
}
