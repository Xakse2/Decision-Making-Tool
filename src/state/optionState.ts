import { type Item } from '../components/optionComponent';

const defaultId = 1;

export class ItemState {
  public items: Item[] = [];
  private id = defaultId;

  public addItem(item: Omit<Item, 'id'>): void {
    this.items = [...this.items, { ...item, id: this.id++ }];
  }

  public removeItem(id: number): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  public clearItems(): void {
    this.items = [];
    this.id = defaultId;
  }

  public load(key: string): void {
    const date = localStorage.getItem(key);
    if (date) {
      const temporary = JSON.parse(date);
      this.items = temporary.items || [];
      this.id = temporary.id || defaultId;
    }
  }

  public save(key: string): void {
    localStorage.setItem(key, JSON.stringify({ items: this.items, id: this.id }));
  }

  public download(a: HTMLAnchorElement): void {
    const blob = new Blob([JSON.stringify(this.items)]);
    a.href = window.URL.createObjectURL(blob);
    a.download = `xakse.json`;
    a.click();
    window.URL.revokeObjectURL(window.URL.createObjectURL(blob));
  }

  public updateState(data: []): void {
    this.items = data;
  }
}

export const itemState = new ItemState();
