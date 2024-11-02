import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DialogOptions,
  NavigationEvent,
  WhatsNewItem,
} from 'projects/ngx-whats-new/src/public-api';

import { AppComponent } from '../src/app/app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockModalComponent: MockNgxWhatsNewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [MockNgxWhatsNewComponent],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // Get the mock modal component instance
    const modalDebugElement = fixture.debugElement.query(By.directive(MockNgxWhatsNewComponent));
    mockModalComponent = modalDebugElement.componentInstance;

    // Assign the mock modal to the component's modal property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).modal = mockModalComponent;

    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize options correctly', () => {
    expect(component.options).toEqual({
      enableKeyboardNavigation: true,
      clickableNavigationDots: true,
    });
  });

  it('should initialize modals correctly', () => {
    expect(component.modals.length).toBe(4);
    expect(component.modals[0].title).toBe('Whats new in v1.0.0');
    expect(component.modals[1].text).toContain('Lorem ipsum dolor sit amet');
  });

  it('should call openDialog in ngAfterViewInit', () => {
    const openDialogSpy = jest.spyOn(component, 'openDialog');
    component.ngAfterViewInit();
    expect(openDialogSpy).toHaveBeenCalled();
  });

  it('should open the modal when openDialog is called', () => {
    const modalOpenSpy = jest.spyOn(mockModalComponent, 'open');
    component.openDialog();
    expect(modalOpenSpy).toHaveBeenCalled();
  });

  it('should log "Dialog opened" when onOpen is called', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    component.onOpen();
    expect(consoleLogSpy).toHaveBeenCalledWith('Dialog opened');
  });

  it('should log "Dialog closed" when onClose is called', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    component.onClose();
    expect(consoleLogSpy).toHaveBeenCalledWith('Dialog closed');
  });

  it('should log navigation events correctly', () => {
    const consoleInfoSpy = jest.spyOn(console, 'info');
    const navigationEvent: NavigationEvent = {
      previousItem: { index: 0, item: { title: 'Previous item' } },
      currentItem: { index: 1, item: { title: 'Current item' } },
    };
    component.onNavigation(navigationEvent);
    expect(consoleInfoSpy).toHaveBeenCalledWith('Previous item:', navigationEvent.previousItem);
    expect(consoleInfoSpy).toHaveBeenCalledWith('Current item:', navigationEvent.currentItem);
  });
});

@Component({
  selector: 'ngx-whats-new',
  standalone: true,
  template: '',
})
class MockNgxWhatsNewComponent {
  @Input() options?: DialogOptions;
  @Input() items?: WhatsNewItem[];
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() navigation = new EventEmitter<NavigationEvent>();

  open() {
    this.opened.emit();
  }

  close() {
    this.closed.emit();
  }
}
