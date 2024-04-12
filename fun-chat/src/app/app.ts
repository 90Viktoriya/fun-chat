import pageWrapper from '../pages/page';
import BaseComponent from '../components/baseComponent';

class App {
  constructor(
    private wrapper: BaseComponent,
    private root: HTMLElement
  ) {}

  public start(): void {
    this.root.append(this.wrapper.getNode());
  }
}

const app = new App(pageWrapper, document.body);
app.start();
