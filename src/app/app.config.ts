import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {config, INITIAL_CONFIG, initialConfig, NEW_CONFIG, optionsConfig} from './authentication/security/config';
import {HttpErrorInterceptor} from './authentication/http-error.interceptor';
import {SecurityInterceptor} from './authentication/security/security.interceptor';
import {provideToastr} from 'ngx-toastr';
import {SecurityGuard} from './authentication/security/security.guard';
import {provideNgxMask} from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    provideToastr({closeButton: true, progressBar: true}),
    provideNgxMask(),
    {provide: NEW_CONFIG, useValue: { nameStorage: 'portalSSOSecurityStorage', loginRouter: '/login'}},
    {provide: INITIAL_CONFIG, useValue: initialConfig},
    {provide: config, useFactory: _configFactory, deps: [INITIAL_CONFIG, NEW_CONFIG]},
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: SecurityInterceptor, multi: true},
    SecurityGuard,
  ]
};

export function _configFactory(initConfig: optionsConfig, configValue: optionsConfig | (() => optionsConfig)): Function | optionsConfig {
  return (typeof configValue === 'function') ? configValue() : { ...initConfig, ...configValue };
}
