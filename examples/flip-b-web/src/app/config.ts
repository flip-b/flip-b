import { environment } from '../environments/environment';
import { home } from './pages/home/home.config';
import { user } from './pages/user/user.config';
import { accounts } from './views/accounts/accounts.config';
import { places } from './views/places/places.config';
import { products } from './views/products/products.config';
import { users } from './views/users/users.config';

export const config: any = {
  name: 'Example',

  // Define URL
  path: '/api/v1',

  // Define language
  language: 'es',

  // Define country
  country: 'ar',

  // Define currency
  currency: 'ars',

  // Define website
  website: 'https://www.example.com',

  // Define version
  version: '1.1.0',

  // Define theme (light, dark)
  theme: 'light',

  // Define color
  color: '#00467f',

  // Define color contrast
  color_contrast: '#ffffff',

  // Define image
  image: `assets/background.jpg`,

  // Define pages
  pages: [home, user, accounts, places, products, users],

  // Define form options
  form: {},

  // Define menu options
  menu: {},

  // Define maps options
  maps: { key: '' },

  // Define ionic options
  ionic: {
    //mode: 'md'
  },

  // Define worker options
  worker: {
    enabled: environment.production,
    registrationStrategy: 'registerWhenStable:30000'
  },

  // From environment
  ...environment
};
