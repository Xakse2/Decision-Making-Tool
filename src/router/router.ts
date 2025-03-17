import { type BaseComponent } from '../components/baseComponent';

export interface path<T extends BaseComponent = BaseComponent> {
  url: string;
  component: () => Promise<T>;
}

export class Router {
  private outlet: BaseComponent;

  constructor(outlet: BaseComponent) {
    this.outlet = outlet;
    this.reLoad();
  }

  public async go(url: string): Promise<void> {
    history.pushState(null, '', url);
    const route = APP_URL.find((route) => route.url === url);
    if (!route) {
      return;
    }
    this.draw(route);
  }

  private async reLoad(): Promise<void> {
    const currentUrl = window.location.pathname;
    await this.go(currentUrl);
  }

  private async draw(url: path): Promise<void> {
    this.outlet.destroyChildren();
    const component = await url.component();
    this.outlet.append(component);
  }
}

export const APP_URL = [
  {
    url: '/slots',
    component: (): Promise<BaseComponent<'div'>> =>
      import('../core/slots').then((m) => new m.Slots()),
  },
  {
    url: '/wheel',
    component: (): Promise<BaseComponent<'div'>> =>
      import('../core/wheel').then((m) => new m.Wheel()),
  },
];
