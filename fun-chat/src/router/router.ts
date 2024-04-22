import type { RouterType } from './router.type';
import PATH_SEGMENTS_TO_KEEP from './router.constants';

class Router {
  routes;

  checkRedirection;

  constructor(routes: RouterType[], checkRedirection: (url: string) => string | null) {
    this.routes = routes;
    this.checkRedirection = checkRedirection;
    document.addEventListener('DOMContentLoaded', () => {
      this.navigate(
        window.location.pathname
          .split('/')
          .slice(PATH_SEGMENTS_TO_KEEP + 1)
          .join('/')
      );
    });
  }

  public navigate(url: string) {
    const pathParts = window.location.pathname.split('/');
    let result = this.checkRedirection(url);
    if (result === null) {
      result = url;
    }
    window.history.pushState({}, '', `/${pathParts.slice(1, PATH_SEGMENTS_TO_KEEP + 1).join('/')}/${result}`);
    const route = this.routes?.find((item) => item.path === result);
    if (typeof route === 'undefined') {
      const error = this.routes?.find((item) => item.path === 'error');
      error?.callback();
      return;
    }
    route.callback();
  }
}

export default Router;
