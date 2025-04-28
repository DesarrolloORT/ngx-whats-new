import {
  ApplicationConfig,
  provideAppInitializer,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { UiUtils } from '@desarrolloort/ngx-utils';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideAppInitializer(() => UiUtils.initializeMaterialSymbols()),
    provideAnimations(),
  ],
};
