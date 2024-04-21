import BaseComponent from '../../components/baseComponent';
import './mainPage.css';
import FOOTER from './footerBlock';
import store from '../../store/store';
import CLASS_NAMES from './mainPage.constants';
import type { PageType } from '../pages.types';
import type { MessageResponse, MessageStatus, UserResponse } from '../../api/websocket.type';
import Dialog from '../../features/dialogBlock/dialogBlock';
import type Websocket from '../../api/websocket';

class MainPage {
  mainPage;

  userList;

  searchInput;

  dialog;

  pageType: PageType = 'main';

  headerBlock;

  constructor(logoutUser: () => void, showAbout: () => void, connection: Websocket) {
    this.headerBlock = new BaseComponent(
      { tag: 'section', className: CLASS_NAMES.header },
      new BaseComponent({ textContent: 'FUN CHAT', className: CLASS_NAMES.title }),
      new BaseComponent(
        { className: CLASS_NAMES.userData },
        new BaseComponent({ textContent: `User: ${store.getUserData().name}`, className: CLASS_NAMES.label }),
        new BaseComponent(
          { className: CLASS_NAMES.buttonsWrapper },
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
      )
    );
    this.searchInput = new BaseComponent({
      tag: 'input',
      type: 'text',
      className: CLASS_NAMES.userListInput,
      placeholder: 'Search...',
      onkeyup: () => this.filterUserList()
    });
    this.userList = new BaseComponent({ tag: 'lu', className: CLASS_NAMES.userList });
    const userListWrapper = new BaseComponent(
      { className: CLASS_NAMES.userListWrapper },
      this.searchInput,
      this.userList
    );
    this.dialog = new Dialog(store.getUserData().name, connection, (login: string, count: number) =>
      this.updateCountUnread(login, count)
    );
    this.mainPage = new BaseComponent(
      { tag: 'div', className: CLASS_NAMES.wrapper },
      this.headerBlock,
      new BaseComponent({ className: CLASS_NAMES.mainPart }, userListWrapper, this.dialog.getDialog()),
      FOOTER
    );
  }

  private addUser(user: UserResponse) {
    let className = CLASS_NAMES.userListUser;
    this.dialog.setStatus(user.login, user.isLogined);
    if (user.isLogined) {
      className += ` ${CLASS_NAMES.userListLogined}`;
    }
    this.userList.append(
      new BaseComponent({
        tag: 'li',
        id: user.login,
        className,
        isLogined: user.isLogined,
        textContent: `● ${user.login}`,
        onclick: (event) => {
          if (event?.currentTarget instanceof HTMLElement) {
            this.dialog.loadDialog(event?.currentTarget.id);
          }
        }
      })
    );
  }

  private setUnreadMessage(login: string, count: number) {
    const user = this.userList.getChildrenById(login);
    user?.append(
      new BaseComponent({
        className: CLASS_NAMES.unreadCount,
        tag: 'label',
        textContent: `${count}`
      }).getNode()
    );
  }

  public updateCountUnread(login: string, count: number) {
    const user = this.userList.getChildrenById(login);
    console.log(count);
    console.log(user?.children);
    if (user?.children.length) {
      if (user?.children.length > 0) {
        user?.lastChild?.remove();
      }
    }
    console.log(user?.children);
    if (count > 0) {
      user?.append(
        new BaseComponent({
          className: CLASS_NAMES.unreadCount,
          tag: 'label',
          textContent: `${count}`
        }).getNode()
      );
    }
  }

  public processMessage(message: MessageResponse) {
    const unreadMessage = this.dialog.getMessage(message);
    console.log(unreadMessage);
    if (unreadMessage.count > 0) {
      this.updateCountUnread(unreadMessage.login, unreadMessage.count);
    }
  }

  public processMessages(messages: MessageResponse[]) {
    console.log(messages);
    const unreadMessage = this.dialog.getMessages(messages);
    console.log(unreadMessage);
    if (unreadMessage.count > 0) {
      this.setUnreadMessage(unreadMessage.login, unreadMessage.count);
    }
  }

  public changeStatus(message: MessageStatus) {
    console.log('change');
    this.dialog.changeStatus(message);
  }

  public filterUserList() {
    const input = this.searchInput.getNode();
    if (input instanceof HTMLInputElement) {
      const filter = input.value.toUpperCase();
      const users = Array.from(this.userList.getChildren());
      users.forEach((item) => {
        if (item.id.toUpperCase().indexOf(filter) > -1) {
          item.classList.remove(CLASS_NAMES.userListHide);
        } else {
          item.classList.add(CLASS_NAMES.userListHide);
        }
      });
    }
  }

  public updateUserList(user: UserResponse) {
    const userItem = document.getElementById(user.login);
    if (userItem) {
      this.dialog.updateStatus(user.login, user.isLogined);
      if (user.isLogined) {
        userItem.classList.add(CLASS_NAMES.userListLogined);
      } else {
        userItem.classList.remove(CLASS_NAMES.userListLogined);
      }
    } else {
      this.addUser(user);
    }
  }

  public loadUserList(users: string) {
    const list = JSON.parse(users);
    list.users.forEach((element: UserResponse) => {
      if (element.login === store.getUserData().name) {
        return;
      }
      this.addUser(element);
    });
  }

  public getPage() {
    return this.mainPage;
  }

  public getPageType() {
    return this.pageType;
  }
}

export default MainPage;
