export type Tags = keyof HTMLElementTagNameMap;

export type Props<T extends Tags> = {
  tag?: T;
  className?: string[];
  text?: string;
  parent?: BaseComponent<Tags>;
};

export class BaseComponent<T extends Tags = 'div'> {
  protected readonly _element: HTMLElementTagNameMap[T];
  private readonly _children: BaseComponent<Tags>[] = [];

  constructor(p: Props<T> = {}) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this._element = document.createElement(p.tag ?? 'div') as HTMLElementTagNameMap[T]; // пофиксить мб как то хз че эта такое и как его комитить

    if (p.className) {
      p.className.forEach((name) => {
        this._element.classList.add(name);
      });
    }

    if (p.text) {
      this._element.textContent = p.text;
    }

    p.parent?._element.appendChild(this.element);
  }

  public get element(): HTMLElementTagNameMap[T] {
    return this._element;
  }

  public append(...children: BaseComponent<Tags>[]): void {
    children.forEach((chiled) => {
      this.element.appendChild(chiled.element);
      this._children.push(chiled);
    });
  }

  public destroy(): void {
    this._children.forEach((child) => child.destroy());
    this._element.remove();
  }

  public destroyChildren(): void {
    this._children.forEach((child) => child.destroy());
  }
}
