import BaseComponent from '../components/baseComponent';
import './mainPage.css';
import store from '../store/store';
import { MAIN_PAGE_CLASS_NAMES as CLASS_NAMES } from './pages.constants';
import type { PageType } from './pages.types';

const headerBlock = new BaseComponent(
  { tag: 'section', className: CLASS_NAMES.header },
  new BaseComponent({ tag: 'div', textContent: 'FUN CHAT', className: CLASS_NAMES.title }),
  new BaseComponent(
    { tag: 'div', className: CLASS_NAMES.userData },
    new BaseComponent({ tag: 'div', textContent: 'User:', className: CLASS_NAMES.label }),
    new BaseComponent({ tag: 'div', textContent: store.getUserData().name, className: 'mainPage_inputWrapper' })
  )
);

const footerBlock = new BaseComponent(
  { tag: 'section', className: CLASS_NAMES.footer },
  new BaseComponent(
    { tag: 'div', className: CLASS_NAMES.github },
    new BaseComponent(
      {
        tag: 'a',
        href: 'https://github.com/90Viktoriya',
        textContent: '90Viktoriya',
        className: CLASS_NAMES.githubLink
      },
      new BaseComponent({
        tag: 'img',
        className: CLASS_NAMES.githubIcon,
        src: './src/img/github-icon.svg',
        alt: 'github icon'
      })
    )
  ),
  new BaseComponent({ tag: 'div', textContent: '2024', className: CLASS_NAMES.year }),
  new BaseComponent(
    { tag: 'div', className: CLASS_NAMES.logo },
    new BaseComponent(
      {
        tag: 'a',
        href: 'https://rs.school/js/',
        textContent: 'RS School',
        className: CLASS_NAMES.logoLink
      },
      new BaseComponent({
        tag: 'img',
        className: CLASS_NAMES.logoIcon,
        src: './src/img/rs_school_js.svg',
        alt: 'rs-school icon'
      })
    )
  )
);

export const mainPage = (changePage: (page: PageType) => void) =>
  new BaseComponent(
    { tag: 'div', className: CLASS_NAMES.wrapper },
    headerBlock,
    new BaseComponent({
      tag: 'div',
      textContent: 'Logout',
      className: CLASS_NAMES.button,
      onclick: () => {
        store.setUserData(null);
        changePage('login');
      }
    }),
    footerBlock
  );

export default mainPage;
