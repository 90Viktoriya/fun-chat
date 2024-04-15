import BaseComponent from '../components/baseComponent';
import LoginForm from './loginForm/loginForm';
import MainPage from './mainPage/mainPage';
import CLASS_NAMES from './pages.constants';
import type { PageType } from './pages.types';
import store from '../store/store';
import type { UserData } from '../store/store.types';
import connection from '../api/websocket';
import './page.css';
import AboutPage from './aboutPage/aboutPage';

class PageController {
  currentPage: LoginForm | MainPage;

  mainPage: MainPage | null;

  aboutPage;

  nextPage: PageType;

  connection;

  pageWrapper;

  user: UserData;

  constructor() {
    this.pageWrapper = new BaseComponent({ className: CLASS_NAMES.wrapper });
    this.connection = connection;
    this.mainPage = null;
    if (store.checkUserData()) {
      this.user = store.getUserData();
      this.currentPage = new MainPage(
        () => this.logoutUser(),
        () => this.showAbout()
      );
      this.mainPage = this.currentPage;
    } else {
      this.user = { name: '', password: '' };
      this.currentPage = new LoginForm(
        (user: UserData) => this.loginUser(user),
        () => this.showAbout()
      );
    }
    this.nextPage = this.currentPage.getPageType();
    this.aboutPage = new AboutPage(() => this.closeAbout());
    this.waitConnection();
  }

  public waitConnection() {
    const timer = setInterval(() => {
      if (connection.openStatus) {
        this.loadPage(this.currentPage.getPageType());
        clearInterval(timer);
      }
    }, 0);
  }

  public showAbout() {
    console.log(this.aboutPage.getPage());
    this.pageWrapper.removeChildren();
    this.pageWrapper.append(this.aboutPage.getPage());
  }

  public closeAbout() {
    this.pageWrapper.removeChildren();
    this.pageWrapper.append(this.currentPage.getPage());
  }

  private changePage() {
    if (this.nextPage === this.currentPage.getPageType()) {
      return;
    }
    this.pageWrapper.removeChildren();
    if (this.nextPage === 'login') {
      this.currentPage = new LoginForm(
        (user: UserData) => this.loginUser(user),
        () => this.showAbout()
      );
    }
    if (this.nextPage === 'main') {
      this.currentPage = new MainPage(
        () => this.logoutUser(),
        () => this.showAbout()
      );
      this.mainPage = this.currentPage;
    }
    this.pageWrapper.append(this.currentPage.getPage());
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
    console.log(message);
    if (message === 'OK') {
      if (this.nextPage === 'login') {
        store.clearUserData();
      } else {
        store.setUserData(this.user);
        this.connection.getUsers((status: string, result?: string) =>
          this.mainPage?.loadUserList(status, result ?? '')
        );
      }
      this.changePage();
    } else {
      this.showMessage(message);
      if (this.nextPage === 'main') {
        store.clearUserData();
      }
    }
  }

  public loginUser(user: UserData) {
    this.nextPage = 'main';
    this.user = user;
    this.connection.loginUser(user, (message: string) => this.processMessage(message));
  }

  public logoutUser() {
    this.nextPage = 'login';
    this.connection.logoutUser(store.getUserData(), (message: string) => this.processMessage(message));
  }

  public loadPage(page?: PageType) {
    this.pageWrapper.removeChildren();
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
      this.connection.getUsers((status: string, result?: string) => this.mainPage?.loadUserList(status, result ?? ''));
    }
    this.pageWrapper.append(this.currentPage.getPage());
  }

  public getPage() {
    return this.pageWrapper;
  }
}

export default PageController;
