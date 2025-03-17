import { Router } from '../router/router';
import { BaseComponent } from '../components/baseComponent';

export const BASE_URL = '/Decision-Making-Tool';
export const outlet = new BaseComponent({ tag: 'div', className: ['outlet'] });
export const router = new Router(outlet);

