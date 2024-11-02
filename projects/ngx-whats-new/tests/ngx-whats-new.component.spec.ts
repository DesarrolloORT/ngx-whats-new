import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
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

  it('should open the dialog and emit "opened" event', fakeAsync(() => {
    jest.spyOn(component.opened, 'emit');
    component.open();
    tick(); // Resolve the Promise in open()
    fixture.detectChanges();
    expect(component['isVisible']).toBe(true);
    expect(component.opened.emit).toHaveBeenCalled();
  }));

  it('should close the dialog and emit "closed" event when disableClose is false', () => {
    component.options = { disableClose: false };
    component.open();
    jest.spyOn(component.closed, 'emit');
    component.close();
    fixture.detectChanges();
    expect(component['isVisible']).toBe(false);
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should navigate to next item when goToNext() is called', () => {
    const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }, { title: 'Item 3' }];
    component.items = items;
    component.open();
    jest.spyOn(component.navigation, 'emit');

    expect(component['selectedIndex']).toBe(0);
    component.goToNext();
    expect(component['selectedIndex']).toBe(1);
    expect(component.navigation.emit).toHaveBeenCalledWith({
      previousItem: { index: 0, item: items[0] },
      currentItem: { index: 1, item: items[1] },
    });
  });

  it('should close the dialog when goToNext() is called on the last item', () => {
    const items: WhatsNewItem[] = [{ title: 'Item 1' }];
    component.items = items;
    component.options = { disableClose: false };
    component.open();
    jest.spyOn(component, 'close');

    component.goToNext();
    expect(component.close).toHaveBeenCalled();
  });

  it('should navigate to specified index when navigateTo(index) is called', fakeAsync(() => {
    const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }, { title: 'Item 3' }];
    component.items = items;
    component.open();
    tick(); // Resolve any pending Promises
    fixture.detectChanges();
    jest.spyOn(component.navigation, 'emit');

    component.navigateTo(2);
    expect(component['selectedIndex']).toBe(2);
    expect(component.navigation.emit).toHaveBeenCalledWith({
      previousItem: { index: 0, item: items[0] },
      currentItem: { index: 2, item: items[2] },
    });
  }));

  it('should not navigate when navigateTo(index) is called and clickableNavigationDots is false', fakeAsync(() => {
    const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
    component.items = items;
    component.options = { clickableNavigationDots: false };
    component.open();
    tick(); // Resolve any pending Promises
    fixture.detectChanges();
    jest.spyOn(component.navigation, 'emit');

    component.navigateTo(1);
    expect(component['selectedIndex']).toBe(0); // Should not change
    expect(component.navigation.emit).not.toHaveBeenCalled();
  }));

  it('should navigate to next item on ArrowRight keypress', fakeAsync(() => {
    const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
    component.items = items;
    component.options = { disableClose: false, enableKeyboardNavigation: true };
    component.open();
    tick(); // Resolve any pending Promises
    fixture.detectChanges();
    jest.spyOn(component.navigation, 'emit');

    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    window.dispatchEvent(event);
    fixture.detectChanges();

    expect(component['selectedIndex']).toBe(1);
    expect(component.navigation.emit).toHaveBeenCalledWith({
      previousItem: { index: 0, item: items[0] },
      currentItem: { index: 1, item: items[1] },
    });
  }));

  it('should navigate to previous item on ArrowLeft keypress', fakeAsync(() => {
    const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
    component.items = items;
    component.options = { disableClose: false, enableKeyboardNavigation: true };
    component.open();
    tick(); // Resolve any pending Promises
    component['selectedIndex'] = 1;
    fixture.detectChanges();
    jest.spyOn(component.navigation, 'emit');

    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    window.dispatchEvent(event);
    fixture.detectChanges();

    expect(component['selectedIndex']).toBe(0);
    expect(component.navigation.emit).toHaveBeenCalledWith({
      previousItem: { index: 1, item: items[1] },
      currentItem: { index: 0, item: items[0] },
    });
  }));

  it('should close the dialog on Escape keypress when disableClose is false', fakeAsync(() => {
    component.options = { disableClose: false, enableKeyboardNavigation: true };
    component.open();
    tick(); // Resolve any pending Promises
    jest.spyOn(component, 'close');

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.close).toHaveBeenCalled();
  }));

  it('should focus on close button after view init when disableClose is false', fakeAsync(() => {
    component.options = { disableClose: false };
    component.items = [{ title: 'Item 1' }];
    component.open();
    tick(); // Resolve any pending Promises
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('.wn-close-modal-button'));
    const focusSpy = jest.spyOn(closeButton.nativeElement, 'focus');

    component.ngAfterViewInit();

    expect(focusSpy).toHaveBeenCalled();
  }));

  it('should unregister keyboard listener on ngOnDestroy', () => {
    component.open();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unregisterSpy = jest.spyOn(component as any, 'unregisterKeyboardListener');

    component.ngOnDestroy();

    expect(unregisterSpy).toHaveBeenCalled();
  });

  it('should close the dialog when ArrowRight is pressed on the last item', fakeAsync(() => {
    const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
    component.items = items;
    component.options = { disableClose: false, enableKeyboardNavigation: true }; // Allow closing
    component.open();
    tick(); // Resolve the Promise in open()

    jest.spyOn(component, 'close');

    // Set selectedIndex to the last item
    component['selectedIndex'] = items.length - 1;
    fixture.detectChanges();

    // Simulate ArrowRight keypress
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    window.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.close).toHaveBeenCalled();
  }));

  it('should not navigate when ArrowLeft is pressed on the first item', fakeAsync(() => {
    const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
    component.items = items;
    component.options = { disableClose: false, enableKeyboardNavigation: true };
    component.open();
    tick();
    fixture.detectChanges();

    jest.spyOn(component.navigation, 'emit');

    // Ensure selectedIndex is 0
    component['selectedIndex'] = 0;

    // Simulate ArrowLeft keypress
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    window.dispatchEvent(event);
    fixture.detectChanges();

    // selectedIndex should remain 0
    expect(component['selectedIndex']).toBe(0);
    // Navigation event should not be emitted
    expect(component.navigation.emit).not.toHaveBeenCalled();
  }));

  it('should not navigate or close when an unhandled key is pressed', fakeAsync(() => {
    const items: WhatsNewItem[] = [{ title: 'Item 1' }, { title: 'Item 2' }];
    component.items = items;
    component.options = { disableClose: false, enableKeyboardNavigation: true };
    component.open();
    tick();
    fixture.detectChanges();

    jest.spyOn(component.navigation, 'emit');
    jest.spyOn(component, 'close');

    const initialIndex = component['selectedIndex'];

    // Simulate an unhandled keypress (e.g., 'Enter')
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);
    fixture.detectChanges();

    expect(component['selectedIndex']).toBe(initialIndex);
    expect(component.navigation.emit).not.toHaveBeenCalled();
    expect(component.close).not.toHaveBeenCalled();
  }));

  it('should warn and not navigate when navigateTo is called with no items', () => {
    jest.spyOn(console, 'warn');

    component.items = [];
    component.navigateTo(0);

    expect(console.warn).toHaveBeenCalledWith('NgxWhatsNewComponent: No items to navigate.');
    expect(component['selectedIndex']).toBe(0);
  });

  it('should warn and not navigate when goToNext is called with no items', () => {
    jest.spyOn(console, 'warn');

    component.items = [];
    component.goToNext();

    expect(console.warn).toHaveBeenCalledWith('NgxWhatsNewComponent: No items to navigate.');
    expect(component['selectedIndex']).toBe(0);
  });

  it('should warn and set items to empty array when items is null', () => {
    jest.spyOn(console, 'warn');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component.items as any) = null;

    expect(console.warn).toHaveBeenCalledWith('NgxWhatsNewComponent: No items provided.');
    expect(component.items).toEqual([]);
  });

  it('should warn and set items to empty array when items is empty', () => {
    jest.spyOn(console, 'warn');

    component.items = [];

    expect(console.warn).toHaveBeenCalledWith('NgxWhatsNewComponent: No items provided.');
    expect(component.items).toEqual([]);
  });
});
