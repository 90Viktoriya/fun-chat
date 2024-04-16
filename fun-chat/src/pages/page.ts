import BaseComponent from '../components/baseComponent';
import LoginForm from './loginForm/loginForm';
import MainPage from './mainPage/mainPage';
import CLASS_NAMES from './pages.constants';
import type { PageType } from './pages.types';
import store from '../store/store';
import type { UserData } from '../store/store.types';
import Websocket from '../api/websocket';
import './page.css';
import AboutPage from './aboutPage/aboutPage';
import Router from '../router/router';

class PageController {
  currentPage: LoginForm | MainPage;

  currentPageType: PageType;

  mainPage: MainPage | null;

  aboutPage;

  nextPageType: PageType;

  connection;

  pageWrapper;

  user: UserData;

  routes = [
    {
      path: '',
      callback: () => this.loadPage(this.currentPageType)
    },
    {
      path: 'about',
      callback: () => this.loadPage('about')
    },
    {
      path: 'main',
      callback: () => this.loadPage(this.currentPageType)
    },
    {
      path: 'login',
      callback: () => this.loadPage(this.currentPageType)
    },
    {
      path: 'error',
      callback: () => this.showErrorPage()
    }
  ];

  router;

  constructor() {
    this.pageWrapper = new BaseComponent({ className: CLASS_NAMES.wrapper });
    this.connection = new Websocket(() => this.waitConnection());
    this.mainPage = null;
    this.currentPageType = 'login';
    if (store.checkUserData()) {
      this.user = store.getUserData();
      this.currentPage = new MainPage(
        () => this.logoutUser(),
        () => this.showAbout()
      );
      this.mainPage = this.currentPage;
      this.currentPageType = 'main';
    } else {
      this.user = { name: '', password: '' };
      this.currentPage = new LoginForm(
        (user: UserData) => this.loginUser(user),
        () => this.showAbout()
      );
    }
    this.currentPageType = this.currentPage.getPageType();
    this.nextPageType = this.currentPage.getPageType();
    this.aboutPage = new AboutPage(() => this.closeAbout());
    this.router = new Router(this.routes, (url: string) => this.checkRedirection(url));
    this.waitConnection();
  }

  public checkRedirection(url: string) {
    if (url === 'login' && this.currentPageType === 'main') {
      return 'main';
    }
    if (url === 'main' && this.currentPageType === 'login') {
      return 'login';
    }
    if (url === '') {
      return this.currentPageType;
    }
    return null;
  }

  public waitConnection() {
    const message = new BaseComponent({ tag: 'h1', textContent: 'I try to connect to server' });
    this.pageWrapper.append(message);
    const timer = setInterval(() => {
      if (this.connection.openStatus) {
        message.node.remove();
        if (this.currentPageType === 'main') {
          this.loginUser(store.getUserData());
        }
        this.loadPage(this.currentPageType);
        clearInterval(timer);
      }
    }, 0);
  }

  public showErrorPage() {
    this.pageWrapper.removeChildren();
    this.pageWrapper.append(new BaseComponent({ tag: 'h1', textContent: 'Sorry! Page not found' }));
  }

  public showAbout() {
    this.currentPageType = 'about';
    this.router.navigate('about');
    this.pageWrapper.removeChildren();
    this.pageWrapper.append(this.aboutPage.getPage());
  }

  public closeAbout() {
    this.pageWrapper.removeChildren();
    this.pageWrapper.append(this.currentPage.getPage());
    this.currentPageType = this.currentPage.getPageType();
    this.router.navigate(this.currentPageType);
  }

  private changePage() {
    if (this.nextPageType === this.currentPage.getPageType()) {
      return;
    }
    this.currentPageType = this.nextPageType;
    this.router.navigate(this.nextPageType);
  }

  public showMessage(message: string) {
    const modal = new BaseComponent(
      { className: CLASS_NAMES.messageWrapper },
      new BaseComponent(
        { className: CLASS_NAMES.message, textContent: message },
        new BaseComponent({
          tag: 'div',
          textContent: 'OK',
          className: 'page_button',
          onclick: () => {
            modal.node.remove();
          }
        })
      )
    );
    this.pageWrapper.append(modal);
  }

  private processMessage(message: string) {
    if (message === 'OK') {
      if (this.nextPageType === 'login') {
        store.clearUserData();
      } else {
        store.setUserData(this.user);
      }
      this.changePage();
    } else {
      this.showMessage(message);
      if (this.nextPageType === 'main') {
        store.clearUserData();
      }
    }
  }

  public loginUser(user: UserData) {
    this.nextPageType = 'main';
    this.user = user;
    this.connection.loginUser(user, (message: string) => this.processMessage(message));
  }

  public logoutUser() {
    this.nextPageType = 'login';
    this.connection.logoutUser(store.getUserData(), (message: string) => this.processMessage(message));
  }

  public loadPage(page: PageType) {
    this.pageWrapper.removeChildren();
    this.currentPageType = page;
    if (page === 'about') {
      this.pageWrapper.append(this.aboutPage.getPage());
      return;
    }
    if (page === 'login') {
      this.currentPage = new LoginForm(
        (user: UserData) => this.loginUser(user),
        () => this.showAbout()
      );
    }
    if (page === 'main') {
      this.currentPage = new MainPage(
        () => this.logoutUser(),
        () => this.showAbout()
      );
      this.mainPage = this.currentPage;
      if (this.connection.openStatus) {
        this.connection.getUsers((status: string, result?: string) =>
          this.mainPage?.loadUserList(status, result ?? '')
        );
      }
    }
    this.pageWrapper.append(this.currentPage.getPage());
  }

  public getPage() {
    return this.pageWrapper;
  }
}

export default PageController;
