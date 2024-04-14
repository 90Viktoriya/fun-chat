import type { UserData } from './store.types';
import STORAGE_KEY from './store.constant';

class Store {
  static setUserData(user: UserData) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  static clearUserData() {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  static checkUserData() {
    return sessionStorage.getItem(STORAGE_KEY);
  }

  static getUserData() {
    const result: UserData = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
    return result;
  }
}

export default Store;
