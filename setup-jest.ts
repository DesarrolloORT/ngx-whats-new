import { jest as jestGlobal } from '@jest/globals';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone/index.mjs';

globalThis.jest = jestGlobal; // add jest to global scope
setupZoneTestEnv();
