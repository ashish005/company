import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {provideRouter} from '@angular/router';

import { routes } from './app.routes';
import {COMPANY_SERVICES} from './services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), ...COMPANY_SERVICES
  ]
};
