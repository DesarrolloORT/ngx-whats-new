import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgxWhatsNewModule } from '../../../ngx-whats-new/src/lib/ngx-whats-new.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxWhatsNewModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
