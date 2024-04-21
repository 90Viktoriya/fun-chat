import { type Props } from './baseComponents.type';

class BaseComponent {
  node: HTMLElement;

  protected siblings: number = 0;

  constructor(prop: Props, ...children: (BaseComponent | HTMLElement | null)[]) {
    const node = document.createElement(prop.tag ?? 'div');
    Object.assign(node, prop);
    this.node = node;
    if (children) {
      this.appendChildren(children);
    }
  }

  public checkSiblings() {
    return !!this.siblings;
  }

  public append(el: BaseComponent) {
    if (el) {
      this.node.append(el.node);
    }
  }

  public appendChildren(children: (BaseComponent | HTMLElement | null)[]) {
    children.forEach((el) => {
      if (el) {
        if (el instanceof BaseComponent) {
          this.node.append(el.node);
        } else {
          this.node.append(el);
        }
      }
    });
  }

  public after(child: BaseComponent | HTMLElement) {
    if (child instanceof HTMLElement) {
      this.node.after(child);
    } else {
      this.node.after(child.getNode());
    }
    this.siblings += 1;
  }

  public removeChildren() {
    this.node.replaceChildren();
  }

  public removeSiblings() {
    while (this.siblings > 0) {
      this.node.nextElementSibling?.remove();
      this.siblings -= 1;
    }
  }

  public addClass(className: string) {
    this.node.classList.add(className);
  }

  public removeClass(className: string) {
    this.node.classList.remove(className);
  }

  public getLastChildren() {
    return this.node.lastElementChild;
  }

  public getChildrenById(id: string) {
    return this.node.children.namedItem(id);
  }

  public removeChild(node: HTMLElement) {
    if (this.node.children.namedItem(node.id)) {
      this.node.removeChild(node);
    }
  }

  public getChildren() {
    return this.node.children;
  }

  public getNode() {
    return this.node;
  }
}

export default BaseComponent;
