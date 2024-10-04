import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables, } from 'ng2-charts';
import { BarController, Colors, Legend } from 'chart.js';
import './charts.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
      }),
    ),
    provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    provideCharts({ registerables: [BarController, Legend, Colors] })
  ]
};
