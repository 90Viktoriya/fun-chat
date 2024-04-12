import BaseComponent from '../components/baseComponent';
import store from '../store/store';
import './loginForm.css';
import { LOGIN_FORMS_CLASS_NAMES as CLASS_NAMES, LOGIN_FORMS } from './pages.constants';
import type { PageType } from './pages.types';

const inputComponents = LOGIN_FORMS.map(
  (component) =>
    new BaseComponent({
      tag: 'input',
      type: component.type,
      id: component.id,
      required: '1',
      className: CLASS_NAMES.input
    })
);

function markInvalidInput() {
  let result = true;
  inputComponents.forEach((component) => {
    if (component.checkSiblings()) {
      component.addClass('loginForm_input-invalid');
      result = false;
    } else {
      component.removeClass('loginForm_input-invalid');
    }
  });
  return result;
}

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

function checkInputs() {
  inputComponents.forEach((component) => component.removeSiblings());
  const [nameValue, passwordValue] = inputComponents.map((component, index) => {
    const node = component.getNode();
    if (node instanceof HTMLInputElement) {
      const value = node.value ?? '';
      checkValues(value, component, LOGIN_FORMS[index]?.checkFirst ?? false, LOGIN_FORMS[index]?.minLetters);
      return value;
    }
    return '';
  });

  if (markInvalidInput()) {
    store.setUserData({ name: nameValue ?? '', password: passwordValue ?? '' });
    return true;
  }
  return false;
}

function createInputBlocks() {
  const result: BaseComponent[] = [];
  inputComponents.forEach((component, index) => {
    result.push(
      new BaseComponent(
        { tag: 'div', className: CLASS_NAMES.inputBlock },
        new BaseComponent({ tag: 'label', textContent: LOGIN_FORMS[index]?.textContent, className: CLASS_NAMES.label }),
        new BaseComponent({ tag: 'div', className: CLASS_NAMES.inputWrapper }, component)
      )
    );
  });
  return result;
}

export const loginForm = (changePage: (page: PageType) => void) =>
  new BaseComponent(
    { tag: 'form', className: CLASS_NAMES.wrapper },
    new BaseComponent({ tag: 'h1', textContent: 'Please login!', className: CLASS_NAMES.header }),
    ...createInputBlocks(),
    new BaseComponent({
      tag: 'div',
      textContent: 'Login',
      className: 'loginForm_button',
      onclick: () => {
        if (checkInputs()) {
          changePage('main');
        }
      }
    })
  );
export default loginForm;
