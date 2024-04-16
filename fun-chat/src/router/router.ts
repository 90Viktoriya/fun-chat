import type { RouterType } from './router.type';

class Router {
  routes;

  checkRedirection;

  constructor(routes: RouterType[], checkRedirection: (url: string) => string | null) {
    this.routes = routes;
    this.checkRedirection = checkRedirection;
    document.addEventListener('DOMContentLoaded', () => {
      this.navigate();
    });
  }

  public navigate(url?: string) {
    let result = null;
    if (typeof url === 'undefined') {
      result = this.checkRedirection(window.location.pathname.slice(1));
      if (result === null) {
        window.history.pushState({}, '', window.location.href);
      } else {
        window.history.pushState(
          {},
          '',
          `${window.location.href.slice(0, window.location.href.length - window.location.pathname.length)}/${result}`
        );
      }
    } else {
      window.history.pushState(
        {},
        '',
        `${window.location.href.slice(0, window.location.href.length - window.location.pathname.length)}/${url}`
      );
    }

    const route = this.routes?.find((item) => item.path === window.location.pathname.slice(1));
    if (typeof route === 'undefined') {
      const error = this.routes?.find((item) => item.path === 'error');
      error?.callback();
      return;
    }
    route.callback();
  }
}

export default Router;
