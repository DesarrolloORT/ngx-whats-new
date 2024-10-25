import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { NgxWhatsNewComponent } from 'projects/ngx-whats-new/src/public-api';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [NgxWhatsNewComponent]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
