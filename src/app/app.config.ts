import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [

    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'en-GB' }


  ]
};

// import {
//   ApplicationConfig,
//   provideBrowserGlobalErrorListeners,
//   provideZonelessChangeDetection,
// } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';
// import { provideAnimations } from '@angular/platform-browser/animations';

// import { importProvidersFrom } from '@angular/core';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { HttpClient, provideHttpClient } from '@angular/common/http';

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './i18n/', '.json');
// }

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideHttpClient(),
//     provideAnimations(),
//     provideBrowserGlobalErrorListeners(),
//     provideZonelessChangeDetection(),
//     provideRouter(routes),

//     importProvidersFrom(
//       TranslateModule.forRoot({
//         defaultLanguage: 'en',
//         loader: {
//           provide: TranslateLoader,
//           useFactory: HttpLoaderFactory,
//           deps: [HttpClient],
//         },
//       })
//     ),
//   ],
// };
