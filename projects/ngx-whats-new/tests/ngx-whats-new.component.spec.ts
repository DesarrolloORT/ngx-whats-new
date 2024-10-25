import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxWhatsNewComponent } from '../src/lib/ngx-whats-new.component';

describe('NgxWhatsNewComponent', () => {
  let component: NgxWhatsNewComponent;
  let fixture: ComponentFixture<NgxWhatsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxWhatsNewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxWhatsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
