import BaseComponent from '../../components/baseComponent';
import './mainPage.css';
import FOOTER from './footerBlock';
import store from '../../store/store';
import CLASS_NAMES from './mainPage.constants';
import type { PageType } from '../pages.types';
import type { UserResponse } from '../../api/websocket.type';

class MainPage {
  mainPage;

  userList;

  dialog;

  pageType: PageType = 'main';

  headerBlock;

  constructor(logoutUser: () => void, showAbout: () => void) {
    this.headerBlock = new BaseComponent(
      { tag: 'section', className: CLASS_NAMES.header },
      new BaseComponent({ textContent: 'FUN CHAT', className: CLASS_NAMES.title }),
      new BaseComponent(
        { className: CLASS_NAMES.userData },
        new BaseComponent({ textContent: 'User:', className: CLASS_NAMES.label }),
        new BaseComponent({ textContent: store.getUserData().name, className: 'mainPage_inputWrapper' }),
        new BaseComponent({
          textContent: 'Logout',
          className: CLASS_NAMES.button,
          onclick: () => {
            logoutUser();
          }
        }),
        new BaseComponent({
          textContent: 'About',
          className: CLASS_NAMES.button,
          onclick: () => {
            showAbout();
          }
        })
      )
    );
    this.userList = new BaseComponent({ className: CLASS_NAMES.userListWrapper });
    this.dialog = new BaseComponent({ className: CLASS_NAMES.dialogWrapper });
    this.mainPage = new BaseComponent(
      { tag: 'div', className: CLASS_NAMES.wrapper },
      this.headerBlock,
      new BaseComponent({ className: CLASS_NAMES.mainPart }, this.userList, this.dialog),
      FOOTER
    );
  }

  public loadUserList(status: string, users: string) {
    if (status === 'OK') {
      const list = JSON.parse(users);
      list.users.forEach((element: UserResponse) => {
        if (element.login === store.getUserData().name) {
          return;
        }
        let className = CLASS_NAMES.userList;
        if (element.isLogined) {
          className += ` ${CLASS_NAMES.userListLogined}`;
        }
        this.userList.append(
          new BaseComponent({
            tag: 'li',
            className,
            textContent: element.login
          })
        );
      });
    }
  }

  public getPage() {
    return this.mainPage;
  }

  public getPageType() {
    return this.pageType;
  }
}

export default MainPage;
