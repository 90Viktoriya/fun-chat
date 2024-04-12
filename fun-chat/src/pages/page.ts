import BaseComponent from '../components/baseComponent';
import { loginForm } from './loginForm';
import { mainPage } from './mainPage';
import { PAGES_CLASS_NAMES as CLASS_NAMES } from './pages.constants';
import type { PageType } from './pages.types';
import store from '../store/store';

const pageWrapper = new BaseComponent({ className: CLASS_NAMES.wrapper });

function loadPage(page?: PageType) {
  pageWrapper.removeChildren();
  if (page === 'login') {
    pageWrapper.append(loginForm(loadPage));
  }
  if (page === 'main') {
    pageWrapper.append(mainPage(loadPage));
  }
}

loadPage(store.checkUserData() ? 'main' : 'login');

export default pageWrapper;
