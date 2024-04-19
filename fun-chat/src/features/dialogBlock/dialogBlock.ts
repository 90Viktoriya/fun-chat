import BaseComponent from '../../components/baseComponent';
import CLASS_NAMES from './dialogBlock.constants';
import './dialogBlock.css';

class Dialog {
  wrapper;

  header;

  mainPart;

  sendArea;

  messageInput;

  constructor() {
    this.messageInput = new BaseComponent({
      tag: 'input',
      type: 'text',
      className: CLASS_NAMES.messageInput,
      required: '1',
      placeholder: 'Message...',
      onkeydown: (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.sendMessage();
        }
      }
    });
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

  private sendMessage() {
    console.log(this.messageInput);
  }

  public loadDialog(login: string) {
    this.header.append(new BaseComponent({ textContent: login }));
  }

  getDialog() {
    return this.wrapper;
  }
}

export default Dialog;
