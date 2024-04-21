import { ID } from './dialogBlock.constants';
import type { MessageStatus } from '../../api/websocket.type';
import type { MessageMap, DataMap } from './dialogBlock.type';

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

function findMessage(array: DataMap, id: string) {
  let messageKey = '';
  let messageIndex = -1;
  let fined = false;
  array.forEach((items, key) => {
    if (fined) {
      return;
    }
    messageIndex = items.findIndex((item) => item.id === id);
    if (messageIndex > -1) {
      messageKey = key;
      fined = true;
    }
  });
  return { messageKey, messageIndex };
}
export function deleteMessageFromData(array: DataMap, id: string) {
  const messageData = findMessage(array, id);
  const messages = array.get(messageData.messageKey);
  if (messages) {
    messages?.splice(messageData.messageIndex, 1);
    if (messages.length > 0) {
      array.set(messageData.messageKey, messages);
    } else {
      array.delete(messageData.messageKey);
    }
  }
  return messageData.messageKey;
}

export function deleteMessage(array: MessageMap, login: string, id: string) {
  console.log(array);
  const messages = array.get(login);
  const index = messages?.indexOf(id) ?? -1;
  messages?.splice(index, 1);
  if (messages) {
    array.set(login, messages);
  } else {
    array.delete(login);
  }
  if (index > -1) {
    return true;
  }
  return false;
}

export function updateData(array: DataMap, id: string, text: string) {
  const messageData = findMessage(array, id);
  const messages = array.get(messageData.messageKey);
  if (messages) {
    const message = messages[messageData.messageIndex];
    if (message) {
      message.text = text;
      message.status.isEdited = true;
      array.set(messageData.messageKey, messages);
    }
  }
}
