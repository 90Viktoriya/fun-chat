import BaseComponent from '../../components/baseComponent';
import { DIALOG_CLASS_NAMES as CLASS_NAMES, ID } from './dialogBlock.constants';

export function createInput(callback: () => void) {
  return new BaseComponent({
    tag: 'input',
    type: 'text',
    className: `${CLASS_NAMES.messageInput} ${CLASS_NAMES.inputDisable}`,
    required: '1',
    pattern: `(\\s*\\S+\\s*){1,}`,
    placeholder: 'Message...',
    onkeydown: (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        callback();
      }
    }
  });
}

export function createSendArea(messageInput: BaseComponent, callback: () => void) {
  return new BaseComponent(
    { tag: 'form', className: CLASS_NAMES.sendPart },
    messageInput,
    new BaseComponent({
      textContent: 'Send',
      className: CLASS_NAMES.button,
      onclick: () => callback()
    })
  );
}

export function createSeparateLine() {
  return new BaseComponent({
    className: CLASS_NAMES.separateLine,
    textContent: 'New messages',
    id: ID.separateLine
  });
}

export function createMessageFooter(editedStatus: string, status: string) {
  return new BaseComponent(
    { className: CLASS_NAMES.messageFooter },
    new BaseComponent({ className: CLASS_NAMES.messageEdited, textContent: editedStatus }),
    new BaseComponent({
      className: CLASS_NAMES.messageStatus,
      textContent: status
    })
  );
}

export function createMessageHeader(login: string, date: number) {
  return new BaseComponent(
    { className: CLASS_NAMES.messageHeader },
    new BaseComponent({ className: CLASS_NAMES.messageHeaderUser, textContent: login }),
    new BaseComponent({
      className: CLASS_NAMES.messageHeaderTime,
      textContent: new Date(date).toLocaleString()
    })
  );
}

export function createContextMenu(top: number, deleteCallback: () => void, editCallback: () => void) {
  return new BaseComponent(
    { id: ID.contextMenu, className: CLASS_NAMES.contextMenuWrapper, style: `top: ${top}px` },
    new BaseComponent({
      className: CLASS_NAMES.contextMenuDelete,
      textContent: 'Delete',
      onclick: () => deleteCallback()
    }),
    new BaseComponent({
      className: CLASS_NAMES.contextMenuEdit,
      textContent: 'Edit',
      onclick: () => editCallback()
    })
  );
}
