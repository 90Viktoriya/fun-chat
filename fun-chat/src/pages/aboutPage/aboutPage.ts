import BaseComponent from '../../components/baseComponent';
import './aboutPage.css';
import CLASS_NAMES from './aboutPage.constants';

class AboutPage {
  page;

  constructor(closeAbout: () => void) {
    this.page = new BaseComponent(
      { className: CLASS_NAMES.wrapper },
      new BaseComponent({ tag: 'h1', textContent: 'FUN CHAT', className: CLASS_NAMES.header }),
      new BaseComponent({
        textContent: "Application created special for RS School. It's a good practice to work with WebSocket.",
        className: CLASS_NAMES.data
      }),
      new BaseComponent({
        tag: 'a',
        href: 'https://github.com/90Viktoriya',
        textContent: 'Author: 90Viktoriya',
        className: CLASS_NAMES.githubLink
      }),
      new BaseComponent({
        textContent: 'OK',
        className: CLASS_NAMES.button,
        onclick: () => {
          closeAbout();
        }
      })
    );
  }

  public getPage() {
    return this.page;
  }
}

export default AboutPage;
