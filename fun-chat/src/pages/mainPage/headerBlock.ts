import BaseComponent from '../../components/baseComponent';
import store from '../../store/store';
import CLASS_NAMES from './mainPage.constants';

function createHeader(logoutUser: () => void, showAbout: () => void) {
  return new BaseComponent(
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
}

export default createHeader;
