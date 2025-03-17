import { BaseComponent } from '../components/baseComponent';
import { router, outlet, BASE_URL } from '../other/routerchet';
import './app.scss';

export class App extends BaseComponent<'div'> {
  constructor() {
    super({ className: ['app'] });
    if (
      window.location.pathname === BASE_URL ||
      window.location.pathname === BASE_URL + '/' ||
      window.location.pathname === '/'
    ) {
      router.go('/slots');
    }
    console.log(window.location.pathname);
    this.append(outlet);
  }
}
