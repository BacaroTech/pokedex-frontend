import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
<<<<<<< HEAD
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
=======
>>>>>>> main

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
<<<<<<< HEAD
    provideRouter(routes), provideClientHydration(withEventReplay())
=======
    provideRouter(routes)
>>>>>>> main
  ]
};
