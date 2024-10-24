import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxWhatsNewModule } from '../../../ngx-whats-new/src/lib/ngx-whats-new.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxWhatsNewModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
