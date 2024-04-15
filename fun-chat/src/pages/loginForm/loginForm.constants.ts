export const LOGIN_FORMS = [
  { id: 'first_name', type: 'text', checkFirst: true, minLetters: 4, textContent: 'Name:' },
  { id: 'password', type: 'password', checkFirst: false, minLetters: 8, textContent: 'Password:' }
];

export const LOGIN_FORMS_CLASS_NAMES = {
  wrapper: 'loginForm_wrapper',
  header: 'loginForm_header',
  info: 'loginForm_info',
  input: 'loginForm_input',
  inputBlock: 'loginForm_input-block',
  inputWrapper: 'loginForm_input-wrapper',
  label: 'loginForm_label',
  inputInvalid: 'loginForm_input-invalid',
  button: 'loginForm_button',
  loginButton: 'loginForm_button-login'
};
