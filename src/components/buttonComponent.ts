import { BaseComponent, type Props } from './baseComponent';

export interface buttonProps extends Props<'button'> {
  onClick?: () => void;
}

export class ButtonComponent extends BaseComponent<'button'> {
  constructor(p: buttonProps = {}) {
    super({
      tag: 'button',
      ...p,
    });

    if (p.onClick) {
      this.element.addEventListener('click', p.onClick);
    }
  }
}
