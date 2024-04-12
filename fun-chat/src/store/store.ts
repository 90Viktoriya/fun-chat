import type { UserData } from './store.types';

class Store {
  static setUserData(user: UserData | null) {
    if (user === null) {
      sessionStorage.removeItem('lOginData');
    } else {
      sessionStorage.setItem('lOginData', JSON.stringify(user));
    }
  }

  static checkUserData() {
    return sessionStorage.getItem('lOginData');
  }

  static getUserData() {
    const result: UserData = JSON.parse(sessionStorage.getItem('lOginData') || '[]');
    return result;
  }
}

export default Store;
