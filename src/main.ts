/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './app/shared/interceptors/base-url.interceptor';
import { authInterceptor } from './app/shared/interceptors/auth.interceptor';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// import { provideGoogleId } from './app/auth/google-login/google-login.config';
// import { provideFacebookId } from './app/auth/facebook-login/facebook-login.config';
defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding(), withRouterConfig({paramsInheritanceStrategy: 'always'})),
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
    // provideGoogleId('746820501392-oalflicqch2kuc12s8rclb5rf7b1fist.apps.googleusercontent.com'),
    // provideFacebookId('553644377672043', 'v22.0'),
  ],
});
