export const LOGIN_FORMS = [
  { id: 'first_name', type: 'text', checkFirst: true, minLetters: 4, textContent: 'Name:' },
  { id: 'password', type: 'password', checkFirst: false, minLetters: 8, textContent: 'Password:' }
];

export const PAGES_CLASS_NAMES = {
  wrapper: 'page_wrapper'
};

export const MAIN_PAGE_CLASS_NAMES = {
  wrapper: 'mainPage_wrapper',
  header: 'mainPage_header',
  userData: 'mainPage_header-userData',
  title: 'mainPage_header-title',
  label: 'mainPage_label',
  button: 'mainPage_button',
  footer: 'mainPage_footer',
  github: 'mainPage_github',
  githubIcon: 'mainPage_github-icon',
  githubLink: 'mainPage_github-link',
  year: 'mainPage_year',
  logo: 'mainPage_logo',
  logoIcon: 'mainPage_logo-icon',
  logoLink: 'mainPage_logo-link'
};

export const LOGIN_FORMS_CLASS_NAMES = {
  wrapper: 'loginForm_wrapper',
  header: 'loginForm_header',
  info: 'loginForm_info',
  input: 'loginForm_input',
  inputBlock: 'loginForm_input-block',
  inputWrapper: 'loginForm_input-wrapper',
  label: 'loginForm_label',
  inputInvalid: 'loginForm_input-invalid',
  button: 'loginForm_button'
};
