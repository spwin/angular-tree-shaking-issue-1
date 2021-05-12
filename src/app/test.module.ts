import { InjectionToken, NgModule } from '@angular/core';
import { testConst } from './types';

@NgModule()
export class TestModule {
  static initialize() {
    return {
      ngModule: TestModule,
      providers: [
        { provide: new InjectionToken('Const'), useValue: testConst }, // just to use somewhere
      ],
    };
  }
}
