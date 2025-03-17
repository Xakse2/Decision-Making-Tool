import { BaseComponent } from '../components/baseComponent';
import { ButtonComponent } from '../components/buttonComponent';
import type { ItemState } from '../state/optionState';
import { itemState } from '../state/optionState';
import { type Item, OptionComponent } from '../components/optionComponent';
import { router } from '../other/routerchet';
import { ListComponent } from '../components/pastList';
import './slots.scss';

export class Slots extends BaseComponent<'div'> {
  private readonly state = itemState;
  private readonly list: BaseComponent<'ul'>;

  constructor() {
    super({
      className: ['slot'],
    });

    const a = document.createElement('a'); // for download file
    const uploadInput = document.createElement('input'); //to upload file

    const appNameLabel = new BaseComponent({
      tag: 'label',
      className: ['app-name'],
      text: 'Decision Making Tool',
    });
    const add = new ButtonComponent({
      className: ['button'],
      text: 'add',
      onClick: (): void => {
        this.createItem();
        this.drawList(this.state.items);
        this.localSave('xakse');
      },
    });

    const clear = new ButtonComponent({
      className: ['button'],
      text: 'clear',
      onClick: (): void => {
        this.clearItem();
        this.drawList(this.state.items);
        this.localSave('xakse');
      },
    });

    const start = new ButtonComponent({
      className: ['button'],
      text: 'start',
      onClick: (): void => {
        if (Slots.validator(itemState)) {
          router.go('/wheel');
        } else {
          this.wronValidator();
        }
      },
    });

    const past = new ButtonComponent({
      className: ['button'],
      text: 'past list',
      onClick: (): void => this.pastList(),
    });

    const download = new ButtonComponent({
      className: ['button'],
      text: 'download',
      onClick: (): void => {
        this.download(a);
      },
    });

    const upload = new ButtonComponent({
      className: ['button'],
      text: 'upload',
      onClick: (): void => {
        this.openFileDialog(uploadInput);
      },
    });

    const buttonContainer = new BaseComponent({ className: ['button-container'] });
    buttonContainer.append(add, clear, past, start, download, upload);

    this.list = new BaseComponent({ tag: 'ul', className: ['list'] });

    this.append(appNameLabel, buttonContainer, this.list);

    this.state.load('xakse');
    this.drawList(this.state.items);
  }

  private static validator(data: ItemState): boolean {
    let count = 0;
    data.items.forEach((item) => {
      if (item.text !== '' && item.weight > 0) {
        count += 1;
      }
    });
    if (count < 2) {
      return false;
    }
    return true;
  }

  public drawList(items: Item[]): void {
    this.list.destroyChildren();

    items.forEach((item) => {
      const itemComponent = new OptionComponent({
        state: item,
        onUpdate: (): void => this.drawList(this.state.items),
        save: (): void => this.localSave('xakse'),
      });
      this.list.append(itemComponent);
    });
  }

  public download(a: HTMLAnchorElement): void {
    this.state.download(a);
  }

  private localSave(key: string): void {
    this.state.save(key);
  }

  private createItem(): void {
    this.state.addItem({ text: '', weight: 0 });
  }
  private clearItem(): void {
    this.state.clearItems();
  }

  private pastList(): void {
    const listComponent = new ListComponent({
      onConfirm: (data: string): void => {
        this.pastListCheck(data);
      },
    });
    this.append(listComponent);
  }

  private pastListCheck(pastList: string): void {
    const arrayData = pastList.split('\n');
    arrayData.forEach((item) => {
      const lastComma = item.lastIndexOf(',');
      if (lastComma === -1) {
        return;
      }
      const part1 = item.slice(0, lastComma);
      const part2 = Number(item.slice(lastComma + 1));

      if (isNaN(part2) || part2 < 0) return;

      this.state.addItem({ text: part1, weight: part2 });
      this.drawList(this.state.items);
      this.localSave('xakse');
    });
  }

  private openFileDialog(uploadInput: HTMLInputElement): void {
    uploadInput.type = 'file';
    uploadInput.accept = 'application/json';
    uploadInput.onchange = async (): Promise<void> => {
      if (!uploadInput.files) {
        return;
      }
      if (!uploadInput.files[0].name.endsWith('.json')) {
        return;
      }
      const file = uploadInput.files[0];
      const text = await file.text();
      const data = JSON.parse(text);
      this.state.updateState(data);
      this.drawList(this.state.items);
    };
    uploadInput.click();
  }

  private wronValidator(): void {
    const wrongWrapper = new BaseComponent({ className: ['wrong-wrapper'] });
    const dialog = new BaseComponent({ className: ['dialog-wrapper'] });
    const message = new BaseComponent({
      tag: 'p',
      text: 'Please add at least 2 valid options. An option is considered valid if its title is not empty and its weight is greater than 0',
    });
    const close = new ButtonComponent({
      className: ['button'],
      text: 'Close',
      onClick: (): void => wrongWrapper.destroy(),
    });
    dialog.append(message, close);
    wrongWrapper.append(dialog);
    this.append(wrongWrapper);
    wrongWrapper.element.addEventListener('click', (event) => {
      if (event.target === wrongWrapper.element) {
        wrongWrapper.destroy();
      }
    });
  }
}
