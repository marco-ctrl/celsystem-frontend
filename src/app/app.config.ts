import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
//import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
//import { BarController, Legend, Colors } from 'chart.js';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
      }),
    ),
    provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync(), provideCharts(withDefaultRegisterables()),
    //provideCharts(withDefaultRegisterables()),
    //provideCharts({ registerables: [BarController, Legend, Colors] })
  ]  
};
