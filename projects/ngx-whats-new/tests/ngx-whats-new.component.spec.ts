import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DialogOptions, WhatsNewItem } from '../src/lib/interfaces';
import { NgxWhatsNewComponent } from '../src/lib/ngx-whats-new.component';

const mockItems: WhatsNewItem[] = [
  {
    title: 'Whats new in v1.0.0',
    html: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.<br /><a href="http://google.com">test</a> ',
    image: {
      src: 'https://picsum.photos/500',
      altText: 'In v1.0.0, lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
    },
    button: {
      text: 'Okay',
      position: 'center',
    },
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just. Spsum dolor sit amet, consectetur adipiscing el aspect et just',
    button: {
      text: 'Got it!',
      position: 'center',
    },
  },
  {
    image: {
      src: 'https://picsum.photos/500/500',
      altText: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
    },
    text: 'Very interesting feature',
    button: {
      text: 'Got it',
      position: 'center',
    },
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just. Spsum dolor sit amet, consectetur adipiscing el aspect et just.',
    image: {
      src: 'https://cdn0.iconfinder.com/data/icons/bakery-10/512/Donut-256.png',
      background: '#333',
      altText: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
    },
    button: {
      text: 'Lets go',
      position: 'center',
    },
  },
];

describe('NgxWhatsNewComponent', () => {
  let component: NgxWhatsNewComponent;
  let fixture: ComponentFixture<NgxWhatsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxWhatsNewComponent, CommonModule, A11yModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxWhatsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.items = mockItems;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy();
    }

    if (fixture) {
      fixture.destroy();
    }

    jest.restoreAllMocks();
  });

  describe('Initialization and configuration', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should use default options if none are provided', () => {
      expect(component.options).toEqual({
        clickableNavigationDots: true,
        enableKeyboardNavigation: true,
        disableClose: true,
      });
    });

    it('should set options correctly when provided', () => {
      const customOptions: DialogOptions = {
        customStyle: {
          maxWidth: '600px',
        },
        clickableNavigationDots: false,
        enableKeyboardNavigation: false,
        disableClose: false,
      };
      component.options = customOptions;
      expect(component.options).toEqual(customOptions);
    });

    it('should set items correctly when provided', () => {
      const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
      component.items = items;
      expect(component.items).toEqual(items);
    });

    it('should focus on close button after view init when disableClose is false', fakeAsync(() => {
      component.options = { disableClose: false };
      component.items = [{ title: 'Item 1' }];
      component.open();
      tick(); // Resolve open() method pending Promise
      fixture.detectChanges();

      const closeButton = fixture.debugElement.query(By.css('.wn-close-modal-button'));
      const focusSpy = jest.spyOn(closeButton.nativeElement, 'focus').mockImplementation();

      component.ngAfterViewInit();

      expect(focusSpy).toHaveBeenCalled();
      focusSpy.mockRestore();
    }));

    it('should warn and set items to empty array when items is null', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component.items as any) = null;

      expect(consoleWarnSpy).toHaveBeenCalledWith('NgxWhatsNewComponent: No items provided.');
      expect(component.items).toEqual([]);
      consoleWarnSpy.mockRestore();
    });

    it('should warn and set items to empty array when items is empty', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      component.items = [];

      expect(consoleWarnSpy).toHaveBeenCalledWith('NgxWhatsNewComponent: No items provided.');
      expect(component.items).toEqual([]);
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Navigation', () => {
    it('should navigate to next item when goToNext() is called', fakeAsync(() => {
      const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }, { title: 'Item 3' }];
      component.items = items;
      component.open();
      tick(); // Resolve open() method pending Promise
      const navigationEmitSpy = jest.spyOn(component.navigation, 'emit').mockImplementation();

      expect(component['_selectedIndex']).toBe(0);
      component.goToNext();
      expect(component['_selectedIndex']).toBe(1);
      expect(navigationEmitSpy).toHaveBeenCalledWith({
        previousItem: { index: 0, item: items[0] },
        currentItem: { index: 1, item: items[1] },
      });
      navigationEmitSpy.mockRestore();
    }));

    it('should close the dialog when goToNext() is called on the last item', fakeAsync(() => {
      const items: WhatsNewItem[] = [{ title: 'Item 1' }];
      component.items = items;
      component.options = { disableClose: false };
      component.open();
      tick(); // Resolve open() method pending Promise
      const closeSpy = jest.spyOn(component, 'close').mockImplementation();

      component.goToNext();
      expect(closeSpy).toHaveBeenCalled();
      closeSpy.mockRestore();
    }));

    it('should navigate to specified index when navigateTo(index) is called', fakeAsync(() => {
      const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }, { title: 'Item 3' }];
      component.items = items;
      component.open();
      tick(); // Resolve open() method pending Promise
      fixture.detectChanges();
      const navigationEmitSpy = jest.spyOn(component.navigation, 'emit').mockImplementation();

      component.navigateTo(2);
      expect(component['_selectedIndex']).toBe(2);
      expect(component.navigation.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          previousItem: expect.objectContaining({ index: 0, item: items[0] }),
          currentItem: expect.objectContaining({ index: 2, item: items[2] }),
        })
      );
      navigationEmitSpy.mockRestore();
    }));

    it('should not navigate when navigateTo(index) is called and clickableNavigationDots is false', fakeAsync(() => {
      const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
      component.items = items;
      component.options = { clickableNavigationDots: false };
      component.open();
      tick(); // Resolve open() method pending Promise
      fixture.detectChanges();
      const navigationEmitSpy = jest.spyOn(component.navigation, 'emit').mockImplementation();

      component.navigateTo(1);
      expect(component['_selectedIndex']).toBe(0); // Should not change
      expect(navigationEmitSpy).not.toHaveBeenCalled();
      navigationEmitSpy.mockRestore();
    }));

    it('should navigate to next item on ArrowRight keypress', fakeAsync(() => {
      const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
      component.items = items;
      component.options = { disableClose: false, enableKeyboardNavigation: true };
      component.open();
      tick(); // Resolve open() method pending Promise
      fixture.detectChanges();
      const navigationEmitSpy = jest.spyOn(component.navigation, 'emit').mockImplementation();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);
      fixture.detectChanges();

      expect(component['_selectedIndex']).toBe(1);
      expect(navigationEmitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          previousItem: expect.objectContaining({ index: 0, item: items[0] }),
          currentItem: expect.objectContaining({ index: 1, item: items[1] }),
        })
      );
      navigationEmitSpy.mockRestore();
    }));

    it('should navigate to previous item on ArrowLeft keypress', fakeAsync(() => {
      const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
      component.items = items;
      component.options = { disableClose: false, enableKeyboardNavigation: true };
      component.open();
      tick(); // Resolve open() method pending Promise
      component['_selectedIndex'] = 1;
      fixture.detectChanges();
      const navigationEmitSpy = jest.spyOn(component.navigation, 'emit').mockImplementation();

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      window.dispatchEvent(event);
      fixture.detectChanges();

      expect(component['_selectedIndex']).toBe(0);
      expect(navigationEmitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          previousItem: expect.objectContaining({ index: 1, item: items[1] }),
          currentItem: expect.objectContaining({ index: 0, item: items[0] }),
        })
      );
      navigationEmitSpy.mockRestore();
    }));

    it('should close the dialog when ArrowRight is pressed on the last item', fakeAsync(() => {
      const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
      component.items = items;
      component.options = { disableClose: false, enableKeyboardNavigation: true }; // Allow closing
      component.open();
      tick(); // Resolve the Promise in open()

      const closeSpy = jest.spyOn(component, 'close').mockImplementation();

      // Set _selectedIndex to the last item
      component['_selectedIndex'] = items.length - 1;
      fixture.detectChanges();

      // Simulate ArrowRight keypress
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);
      fixture.detectChanges();

      expect(closeSpy).toHaveBeenCalled();
      closeSpy.mockRestore();
    }));

    it('should not navigate when ArrowLeft is pressed on the first item', fakeAsync(() => {
      const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
      component.items = items;
      component.options = { disableClose: false, enableKeyboardNavigation: true };
      component.open();
      tick();
      fixture.detectChanges();

      const navigationEmitSpy = jest.spyOn(component.navigation, 'emit').mockImplementation();

      // Ensure _selectedIndex is 0
      component['_selectedIndex'] = 0;

      // Simulate ArrowLeft keypress
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      window.dispatchEvent(event);
      fixture.detectChanges();

      // _selectedIndex should remain 0
      expect(component['_selectedIndex']).toBe(0);
      // Navigation event should not be emitted
      expect(navigationEmitSpy).not.toHaveBeenCalled();
      navigationEmitSpy.mockRestore();
    }));

    it('should warn and not navigate when navigateTo is called with no items', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      component.items = [];
      component.navigateTo(0);

      expect(consoleWarnSpy).toHaveBeenCalledWith('NgxWhatsNewComponent: No items to navigate.');
      expect(component['_selectedIndex']).toBe(0);
    });

    it('should warn and not navigate when goToNext is called with no items', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      component.items = [];
      component.goToNext();

      expect(consoleWarnSpy).toHaveBeenCalledWith('NgxWhatsNewComponent: No items to navigate.');
      expect(component['_selectedIndex']).toBe(0);
    });
  });

  describe('Events', () => {
    it('should open the dialog and emit "opened" event', fakeAsync(() => {
      const openedEmitSpy = jest.spyOn(component.opened, 'emit').mockImplementation();
      component.open();
      tick(); // Resolve the Promise in open()
      fixture.detectChanges();
      expect(component['_isVisible']).toBe(true);
      expect(openedEmitSpy).toHaveBeenCalled();
      openedEmitSpy.mockRestore();
    }));

    it('should close the dialog and emit "closed" event when disableClose is false', fakeAsync(() => {
      component.options = { disableClose: false };
      component.open();
      tick(); // Resolve open() method pending Promise
      const closedEmitSpy = jest.spyOn(component.closed, 'emit').mockImplementation();
      component.close();
      fixture.detectChanges();
      expect(component['_isVisible']).toBe(false);
      expect(closedEmitSpy).toHaveBeenCalled();
      closedEmitSpy.mockRestore();
    }));
  });

  describe('Keyboard events', () => {
    it('should close the dialog on Escape keypress when disableClose is false', fakeAsync(() => {
      component.options = { disableClose: false, enableKeyboardNavigation: true };
      component.open();
      tick(); // Resolve open() method pending Promise
      const closeSpy = jest.spyOn(component, 'close').mockImplementation();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);
      fixture.detectChanges();

      expect(closeSpy).toHaveBeenCalled();
      closeSpy.mockRestore();
    }));

    it('should unregister keyboard listener on ngOnDestroy', fakeAsync(() => {
      component.open();
      tick(); // Resolve open() method pending Promise

      const unregisterSpy = jest
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .spyOn(component as any, '_unregisterKeyboardListener')
        .mockImplementation();

      component.ngOnDestroy();

      expect(unregisterSpy).toHaveBeenCalled();
      unregisterSpy.mockRestore();
    }));

    it('should not navigate or close when an unhandled key is pressed', fakeAsync(() => {
      const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
      component.items = items;
      component.options = { disableClose: false, enableKeyboardNavigation: true };
      component.open();
      tick();
      fixture.detectChanges();

      const navigationEmitSpy = jest.spyOn(component.navigation, 'emit').mockImplementation();
      const closeSpy = jest.spyOn(component, 'close').mockImplementation();

      const initialIndex = component['_selectedIndex'];

      // Simulate an unhandled keypress (e.g., 'Enter')
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      window.dispatchEvent(event);
      fixture.detectChanges();

      expect(component['_selectedIndex']).toBe(initialIndex);
      expect(navigationEmitSpy).not.toHaveBeenCalled();
      expect(closeSpy).not.toHaveBeenCalled();
      navigationEmitSpy.mockRestore();
      closeSpy.mockRestore();
    }));
  });

  describe('Image events', () => {
    let debugElement: DebugElement;
    beforeEach(fakeAsync(() => {
      // Sample items with an image URL
      const items: WhatsNewItem[] = [
        { title: 'Item 1', image: { src: 'valid-image-url.jpg', altText: 'Valid image URL' } },
        { title: 'Item 2', image: { src: 'invalid-image-url.jpg', altText: 'Invalid image URL' } },
      ];
      component.items = items;
      component.open();
      tick(); // Resolve open() method pending Promise

      debugElement = fixture.debugElement;
      fixture.detectChanges();
    }));

    it('should set _imageHasLoaded to true when the image loads successfully', () => {
      // Find the image element in the template
      const imageElement = debugElement.query(By.css('img'));

      // Simulate the image load event
      imageElement.triggerEventHandler('load', {});

      // Run change detection to update bindings
      fixture.detectChanges();

      // Assert that _imageHasLoaded is true
      expect(component['_imageHasLoaded']).toBeTruthy();
    });

    it('should set _imageHasLoaded to false and log a warning when the image fails to load', () => {
      // Spy on console.warn
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Find the image element in the template
      const imageElement = debugElement.query(By.css('img'));

      // Simulate the image error event
      imageElement.triggerEventHandler('error', {});

      // Run change detection to update bindings
      fixture.detectChanges();

      // Assert that _imageHasLoaded is false
      expect(component['_imageHasLoaded']).toBeFalsy();

      // Assert that console.warn was called with the correct message
      expect(consoleWarnSpy).toHaveBeenCalledWith('NgxWhatsNewComponent: Image failed to load.');

      // Restore the original console.warn implementation
      consoleWarnSpy.mockRestore();
    });
  });
});
