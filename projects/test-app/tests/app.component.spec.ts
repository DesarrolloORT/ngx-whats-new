/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DialogOptions,
  NavigationEvent,
  WhatsNewItem,
} from 'projects/ngx-whats-new/src/lib/interfaces';

import { AppComponent } from '../src/app/app.component';

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

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let mockModal: MockNgxWhatsNewComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
    });
    TestBed.overrideComponent(AppComponent, {
      set: {
        imports: [MockNgxWhatsNewComponent],
      },
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // render the template once so our <ngx-whats-new> appears…
    fixture.detectChanges();

    // grab the mock instance and wire it into the private ViewChild
    const modalDbg = fixture.debugElement.query(By.directive(MockNgxWhatsNewComponent));
    mockModal = modalDbg.componentInstance;
    (component as any).modal = mockModal;

    // run change detection again so everything is up-to-date
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize options correctly', () => {
    expect(component.options).toEqual({
      enableKeyboardNavigation: true,
      clickableNavigationDots: true,
      disableSwipeNavigation: false,
      disableClose: false,
    });
  });

  it('should initialize modals correctly', () => {
    expect(component.modals.length).toBe(4);
    // First modal uses simple string for title
    expect(component.modals[0].title).toBe('Whats new in v1.0.0');
    expect(component.modals[0].html).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.<br /><a href="http://google.com">test</a>');
    // Second modal now has title and text with styles
    expect((component.modals[1].title as any).content).toBe('🚀 Enhanced Performance');
    expect((component.modals[1].title as any).style).toBeDefined();
    expect((component.modals[1].text as any).content).toContain('Experience lightning-fast loading');
    expect((component.modals[1].text as any).style).toBeDefined();
  });

  it('should call openDialog in ngAfterViewInit', () => {
    const spy = jest.spyOn(component, 'openDialog');
    // manually trigger the lifecycle hook
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should open the modal when openDialog is called', () => {
    const openSpy = jest.spyOn(mockModal, 'open');
    component.openDialog();
    expect(openSpy).toHaveBeenCalled();
  });

  it('should log "Dialog opened" when onOpen is called', () => {
    const logSpy = jest.spyOn(console, 'log');
    component.onOpen();
    expect(logSpy).toHaveBeenCalledWith('Dialog opened');
  });

  it('should log "Dialog closed" when onClose is called', () => {
    const logSpy = jest.spyOn(console, 'log');
    component.onClose();
    expect(logSpy).toHaveBeenCalledWith('Dialog closed');
  });

  it('should log "Dialog completed" when onCompleted is called', () => {
    const logSpy = jest.spyOn(console, 'log');
    component.onCompleted();
    expect(logSpy).toHaveBeenCalledWith('Dialog completed');
  });

  it('should log navigation events correctly', () => {
    const infoSpy = jest.spyOn(console, 'info');
    const navEvent: NavigationEvent = {
      previousItem: { index: 0, item: { title: 'Previous item' } },
      currentItem: { index: 1, item: { title: 'Current item' } },
    };

    component.onNavigation(navEvent);

    expect(infoSpy).toHaveBeenCalledWith('Previous item:', navEvent.previousItem);
    expect(infoSpy).toHaveBeenCalledWith('Current item:', navEvent.currentItem);
  });
});
