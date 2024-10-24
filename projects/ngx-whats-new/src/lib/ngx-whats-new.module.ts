import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxWhatsNewComponent } from './ngx-whats-new.component';

@NgModule({
  declarations: [NgxWhatsNewComponent],
  imports: [CommonModule, A11yModule],
  exports: [NgxWhatsNewComponent],
})
export class NgxWhatsNewModule {}
