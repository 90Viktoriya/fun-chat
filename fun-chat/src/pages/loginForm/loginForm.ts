import type { UserData } from '../../store/store.types';
import BaseComponent from '../../components/baseComponent';
import './loginForm.css';
import { LOGIN_FORMS_CLASS_NAMES as CLASS_NAMES, LOGIN_FORMS } from './loginForm.constants';
import type { PageType } from '../pages.types';

function checkValues(value: string, child: BaseComponent, checkFirst: boolean, length: number | undefined) {
  const upperFirst = /^[A-Z]{1}/gm;
  const justLetter = /^[a-zA-Z-]+$/gm;
  if (!value.match(upperFirst) && checkFirst) {
    child.after(
      new BaseComponent({ tag: 'div', textContent: 'First letter must be in uppercase', className: CLASS_NAMES.info })
    );
  }
  if (!value.match(justLetter)) {
    child.after(
      new BaseComponent({
        tag: 'div',
        textContent: 'Please enter just English alphabet letters and the hyphen ("-") symbol',
        className: CLASS_NAMES.info
      })
    );
  }
  if (length === undefined) {
    return;
  }
  if (value.length < length) {
    child.after(
      new BaseComponent({
        tag: 'div',
        textContent: `Please enter minimum of ${length} characters`,
        className: CLASS_NAMES.info
      })
    );
  }
}

class LoginForm {
  inputComponents;

  pageType: PageType = 'login';

  form;

  constructor(loginUser: (user: UserData) => void, showAbout: () => void) {
    this.inputComponents = this.createInputComponents(loginUser);
    this.form = new BaseComponent(
      { tag: 'form', className: CLASS_NAMES.wrapper },
      new BaseComponent({ tag: 'h1', textContent: 'Please login!', className: CLASS_NAMES.header }),
      ...this.createInputBlocks(),
      new BaseComponent({
        textContent: 'Login',
        className: `${CLASS_NAMES.button} ${CLASS_NAMES.loginButton}`,
        onclick: () => {
          const user = this.checkInputs();
          if (user) {
            loginUser(user);
          }
        }
      }),
      new BaseComponent({
        textContent: 'About',
        className: CLASS_NAMES.button,
        onclick: () => {
          showAbout();
        }
      })
    );
  }

  private createInputComponents(loginUser: (user: UserData) => void) {
    return LOGIN_FORMS.map(
      (component) =>
        new BaseComponent({
          tag: 'input',
          type: component.type,
          id: component.id,
          required: '1',
          className: CLASS_NAMES.input,
          onkeydown: (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
              const user = this.checkInputs();
              if (user) {
                loginUser(user);
              }
            }
          }
        })
    );
  }

  private createInputBlocks() {
    const result: BaseComponent[] = [];
    this.inputComponents.forEach((component, index) => {
      result.push(
        new BaseComponent(
          { tag: 'div', className: CLASS_NAMES.inputBlock },
          new BaseComponent({
            tag: 'label',
            textContent: LOGIN_FORMS[index]?.textContent,
            className: CLASS_NAMES.label
          }),
          new BaseComponent({ tag: 'div', className: CLASS_NAMES.inputWrapper }, component)
        )
      );
    });
    return result;
  }

  private markInvalidInput() {
    let result = true;
    this.inputComponents.forEach((component) => {
      if (component.checkSiblings()) {
        component.addClass('loginForm_input-invalid');
        result = false;
      } else {
        component.removeClass('loginForm_input-invalid');
      }
    });
    return result;
  }

  private checkInputs() {
    this.inputComponents.forEach((component) => component.removeSiblings());
    const [nameValue, passwordValue] = this.inputComponents.map((component, index) => {
      const node = component.getNode();
      if (node instanceof HTMLInputElement) {
        const value = node.value ?? '';
        checkValues(value, component, LOGIN_FORMS[index]?.checkFirst ?? false, LOGIN_FORMS[index]?.minLetters);
        return value;
      }
      return '';
    });

    if (this.markInvalidInput()) {
      return { name: nameValue ?? '', password: passwordValue ?? '' };
    }
    return null;
  }

  public getPage() {
    return this.form;
  }

  public getPageType() {
    return this.pageType;
  }
}

export default LoginForm;
