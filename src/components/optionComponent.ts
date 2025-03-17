import { BaseComponent, type Props } from './baseComponent';
import { ButtonComponent } from './buttonComponent';
import { itemState } from '../state/optionState';

export interface Item {
  id: number;
  text: string;
  weight: number;
}

export interface ItemProps extends Omit<Props<'div'>, 'tag'> {
  state: Item;
  onUpdate?: () => void;
  save: () => void;
}

export class OptionComponent extends BaseComponent<'li'> {
  private readonly name: BaseComponent<'input'>;
  private readonly weight: BaseComponent<'input'>;
  private readonly state: Item;

  constructor(p: ItemProps) {
    super({
      tag: 'li',
      className: ['item'],
      ...p,
    });

    const id = new BaseComponent({ tag: 'span', text: `#${p.state.id}` });

    this.state = p.state;

    this.name = new BaseComponent({ className: ['input-item'], tag: 'input' });
    this.name.element.value = p.state.text;
    this.name.element.placeholder = 'text';
    this.name.element.addEventListener('change', (): void => {
      this.state.text = this.name.element.value;
      p.save();
    });

    this.weight = new BaseComponent({ className: ['input-item'], tag: 'input' });
    this.weight.element.placeholder = 'weight';
    this.weight.element.type = 'number';
    this.weight.element.value = this.state.weight ? this.state.weight.toString() : '';
    this.weight.element.addEventListener('change', (): void => {
      this.state.weight = Number(this.weight.element.value);
      p.save();
    });

    const removeButton = new ButtonComponent({
      text: 'delete',
      className: ['button'],
      onClick: (): void => {
        itemState.removeItem(this.state.id);
        p.save();
        if (p.onUpdate) {
          p.onUpdate();
        }
      },
    });

    this.append(id, this.name, this.weight, removeButton);
  }
}
