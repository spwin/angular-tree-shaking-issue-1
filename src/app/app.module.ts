import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { TestModule } from './test.module';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, environment.includeModule ? TestModule : []],
  bootstrap: [AppComponent],
  providers: [
    { provide: new InjectionToken('Test'), useValue: environment.nestedObject },
  ],
})
export class AppModule {}
