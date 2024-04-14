import PageController from '../pages/page';

class App {
  constructor(
    private pageController: PageController,
    private root: HTMLElement
  ) {}

  public start(): void {
    this.root.append(this.pageController.getPage().getNode());
  }
}

const app = new App(new PageController(), document.body);
app.start();
