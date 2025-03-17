import { BaseComponent, type Props } from './baseComponent';
import { ButtonComponent } from './buttonComponent';
import './pastList.scss';

export interface listComponentProps extends Props<'div'> {
  onConfirm: (_data: string) => void;
}

export class ListComponent extends BaseComponent<'div'> {
  private input: BaseComponent<'textarea'>;
  private onConfirm: (_data: string) => void;

  constructor(p: listComponentProps) {
    super({
      tag: 'div',
      className: ['input-list'],
      ...p,
    });

    this.onConfirm = p.onConfirm;

    this.input = new BaseComponent({
      className: ['input-field'],
      tag: 'textarea',
    });

    this.input.element.placeholder = `Paste a list of new options in a CSV-like format:
title,1 ->                 | title                 | 1 |
title with whitespace,2 -> | title with whitespace | 2 |
title , with , commas,3 -> | title , with , commas | 3 |
title with "quotes",4   -> | title with "quotes"   | 4 |`;

    this.input.element.rows = 12;
    this.input.element.cols = 64;
    const cancel = new ButtonComponent({
      className: ['button'],
      text: 'cancel',
      onClick: (): void => this.destroy(),
    });

    const confirm = new ButtonComponent({
      className: ['button'],
      text: 'confirm',
      onClick: (): void => {
        const inputData = this.input.element.value;
        this.onConfirm(inputData);
        this.destroy();
      },
    });

    const buttonContainer = new BaseComponent({ className: ['button-container'] });
    buttonContainer.append(cancel, confirm);

    const content = new BaseComponent({ className: ['content-wrapper'] });
    content.append(this.input, buttonContainer);

    this.element.addEventListener('click', (event) => {
      if (event.target === this.element) {
        this.destroy();
      }
    });

    this.append(content);
  }
}
