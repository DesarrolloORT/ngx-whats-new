import { A11yModule } from '@angular/cdk/a11y';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { DialogOptions, NavigationEvent, WhatsNewItem } from './interfaces';
import { ngxWhatsNewAnimations } from './ngx-whats-new.animations';

/** Default swipe threshold in pixels */
const DEFAULT_SWIPE_THRESHOLD = 50;

const DEFAULT_OPTIONS: DialogOptions = {
  clickableNavigationDots: true,
  enableKeyboardNavigation: true,
  disableClose: true,
  disableSwipeNavigation: true,
  swipeThreshold: DEFAULT_SWIPE_THRESHOLD,
};

@Component({
  selector: 'ngx-whats-new',
  imports: [A11yModule, CdkDrag],
  templateUrl: './ngx-whats-new.component.html',
  styleUrls: ['./ngx-whats-new.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  animations: ngxWhatsNewAnimations,
})
export class NgxWhatsNewComponent implements AfterViewInit, OnDestroy {
  constructor(private readonly _self: ElementRef) {
    // Initialize component as hidden by default to avoid blocking content underneath
    // Showing the component will be handled by the open() method
    this._self.nativeElement.style.display = 'none';
  }

  // * -----------------------
  // * Component's public API
  // * -----------------------

  /** Items to show in the dialog */
  @Input() public set items(items: WhatsNewItem[]) {
    if (items && items.length > 0) {
      this._items = items;
    } else {
      console.warn('NgxWhatsNewComponent: No items provided.');
      this._items = [];
    }
    this._resetState();
  }
  public get items(): WhatsNewItem[] {
    return this._items;
  }

  /** DialogOptions for What's New dialog */
  @Input() public set options(options: DialogOptions) {
    this._options = { ...DEFAULT_OPTIONS, ...options };
  }
  public get options() {
    return this._options;
  }

  /**
   * @output itemNavigation - Emits an event whenever the selected item changes.
   * The event payload includes the previous and current index and the corresponding items.
   */
  @Output() public readonly navigation = new EventEmitter<NavigationEvent>();

  /** @output closed - Emits an event on dialog close */
  @Output() public readonly closed = new EventEmitter<void>();

  /** @output completed - Emits an event on dialog close when all items have been viewed */
  @Output() public readonly completed = new EventEmitter<void>();

  /** @output opened - Emits an event on dialog open */
  @Output() public readonly opened = new EventEmitter<void>();

  /** Navigates to the next item. Closes What's New dialog if it is the last one. */
  public goToNext(): void {
    if (this.items.length === 0) {
      console.warn('NgxWhatsNewComponent: No items to navigate.');
      return;
    }

    const previousIndex = this._getSelectedIndex();
    const previousItem = this.items[previousIndex];

    if (previousIndex < this.items.length - 1) {
      this._setSelectedIndex(previousIndex + 1);
      const currentIndex = this._getSelectedIndex();
      const currentItem = this.items[currentIndex];

      this._updateTabIndices();
      this._emitNavigationEvent(previousIndex, previousItem, currentIndex, currentItem);
    } else {
      this._emitCompletedEvent();
    }
  }

  /** Navigates to the previous item. */
  public goToPrevious(): void {
    if (this.items.length === 0) {
      console.warn('NgxWhatsNewComponent: No items to navigate.');
      return;
    }

    const previousIndex = this._getSelectedIndex();
    const previousItem = this.items[previousIndex];

    if (previousIndex > 0) {
      this._setSelectedIndex(previousIndex - 1);
      const currentIndex = this._getSelectedIndex();
      const currentItem = this.items[currentIndex];

      this._updateTabIndices();
      this._emitNavigationEvent(previousIndex, previousItem, currentIndex, currentItem);
    }
  }

  /**
   * Navigates to the item corresponding to the provided number.
   * @param index number of the item
   */
  public navigateTo(index: number): void {
    if (this.items.length === 0) {
      console.warn('NgxWhatsNewComponent: No items to navigate.');
      return;
    }

    const previousIndex = this._getSelectedIndex();
    const previousItem = this.items[previousIndex];

    if (this._options.clickableNavigationDots && index !== previousIndex) {
      this._setSelectedIndex(index);
      const currentIndex = this._getSelectedIndex();
      const currentItem = this.items[currentIndex];

      this._updateTabIndices();
      this._focusButton(index);
      this._emitNavigationEvent(previousIndex, previousItem, currentIndex, currentItem);
    }
  }

  /** Opens What's New dialog. */
  public open(): void {
    Promise.resolve().then(() => {
      this._self.nativeElement.style.display = 'block';
      this._isVisible = true;
      this.opened.emit();
      this._registerKeyboardListener();
      this._resetState();
    });
  }

  /**
   * Closes What's New dialog.
   * @param {boolean} forceClose - Forces the dialog to close even if `disableClose` is set to `true`. Default: `false`
   */
  public close(forceClose: boolean = false): void {
    if (!this._options.disableClose || forceClose) {
      this._self.nativeElement.style.display = 'none';
      this._unregisterKeyboardListener();
      this._isVisible = false;
      this.closed.emit();
      this._resetState();
    }
  }

  /**
   * Sets focus to the close button when the component is initialized.
   *
   * **MANUAL EXECUTION OF THIS FUNCTION IS NOT RECOMMENDED**
   */
  ngAfterViewInit(): void {
    if (this._closeButton) {
      this._closeButton.nativeElement.focus(); // Set focus to the close button
    }
  }

  ngOnDestroy(): void {
    this._unregisterKeyboardListener();
  }

  // * -------------------------------------------
  // * Private or protected methods and properties
  // * -------------------------------------------

  /** DialogOptions item initialized with default values. Accepts custom values. */
  private _options: DialogOptions = DEFAULT_OPTIONS;

  /** Items to show in the dialog */
  private _items: WhatsNewItem[] = [];

  /** Control whether the dialog is visible */
  protected _isVisible = false;

  /** Tracks image loading status */
  protected _imageHasLoaded = false;

  /** Tracks content animation state to trigger re-animations on item change */
  protected _contentAnimationState = 0;

  /** Subscription to keyboard event listener */
  private keyboardEventSubscription?: Subscription;

  /** Reference to the close button */
  @ViewChild('wnCloseButton') private readonly _closeButton?: ElementRef;

  /** Reference to the navigation buttons */
  @ViewChildren('wnNavButton')
  private readonly _navButtons?: QueryList<ElementRef>;

  /** Index of the selected modal item */
  private _selectedIndex = 0;

  /** Getter for the selected index */
  protected _getSelectedIndex(): number {
    return this._selectedIndex;
  }

  /** Setter for the selected index */
  protected _setSelectedIndex(index: number): void {
    this._selectedIndex = index;
    this._imageHasLoaded = false;
    // Trigger content animation by changing the state
    this._contentAnimationState = this._contentAnimationState === 0 ? 1 : 0;
  }

  /** Handles image load event */
  protected _onImageLoad() {
    this._imageHasLoaded = true;
  }

  /** Handles image error event */
  protected _onImageError() {
    this._imageHasLoaded = false;
    console.warn('NgxWhatsNewComponent: Image failed to load.');
  }

  /**
   * Handles drag end event for swipe navigation on touch devices.
   * 
   * Processes horizontal swipe gestures to navigate between slides:
   * - Swipe right (positive X): Navigate to previous slide  
   * - Swipe left (negative X): Navigate to next slide
   * 
   * Only triggers navigation if the drag distance exceeds the configured threshold.
   * 
   * @param event - CDK drag end event containing drag distance information
   */
  protected _onDragEnd(event: CdkDragEnd): void {
    const dragDistance = event.distance.x;
    const threshold = this._options.swipeThreshold || DEFAULT_SWIPE_THRESHOLD;
    
    // Reset position of dragged element to original position
    event.source.reset();
    
    // Only process navigation if drag distance exceeds minimum threshold
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        // Positive X distance = swipe right = previous slide
        this.goToPrevious();
      } else {
        // Negative X distance = swipe left = next slide  
        this.goToNext();
      }
    }
  }

  /** Gets the current image animation state */
  protected _getImageState(): string {
    return this._imageHasLoaded ? 'loaded' : 'loading';
  }

  /** 
   * Checks if swipe navigation should be enabled.
   * 
   * Swipe is enabled when:
   * - disableSwipeNavigation option is not set to true
   * - There are multiple items to navigate between
   * 
   * @returns true if swipe navigation should be active
   */
  protected _isSwipeEnabled(): boolean {
    return this._options.disableSwipeNavigation !== true && this.items.length > 1;
  }

  /**
   * Resets the component's state to its initial values.
   *
   * This method is called when the dialog is opened or closed to ensure that
   * the component does not retain any state from previous interactions.
   */
  private _resetState(): void {
    this._setSelectedIndex(0);
    this._updateTabIndices();
  }

  /**
   * Handles keyboard-based navigation between items.
   *
   * Handled events:
   *  - ArrowRight: next item
   *  - ArrowLeft: previous item
   *  - Escape: close dialog
   * @param $event keyboard event
   */
  protected _handleKeyboardNavigation($event: KeyboardEvent): void {
    if (this._options.enableKeyboardNavigation) {
      let nextIndex = this._getSelectedIndex();
      switch ($event.key) {
        case 'ArrowRight':
          if (nextIndex < this.items.length - 1) {
            nextIndex++;
          } else {
            this._emitCompletedEvent();
            return;
          }
          break;
        case 'ArrowLeft':
          if (nextIndex > 0) {
            nextIndex--;
          } else return;
          break;
        case 'Escape':
          this.close();
          return;
        default:
          break;
      }

      if (nextIndex !== this._getSelectedIndex()) {
        const previousIndex = this._getSelectedIndex();
        const previousItem = this.items[previousIndex];
        this._setSelectedIndex(nextIndex);
        this._updateTabIndices();
        this._focusButton(this._getSelectedIndex());
        this._emitNavigationEvent(previousIndex, previousItem, nextIndex, this.items[nextIndex]);
        $event.preventDefault();
      }
    }
  }

  /**
   * Updates the `tabindex` and `aria-selected` attributes for all navigation buttons.
   *
   * This method ensures that only the currently selected button is focusable via keyboard navigation
   * by setting its `tabindex` to `0`, while all other buttons have `tabindex` set to `-1`.
   * Additionally, it updates the `aria-selected` attribute to reflect the current selection state,
   * enhancing accessibility for assistive technologies.
   */
  private _updateTabIndices(): void {
    this._navButtons?.forEach((ref, index) => {
      const button = ref.nativeElement;
      button.tabIndex = index === this._getSelectedIndex() ? 0 : -1;
      button.setAttribute('aria-selected', index === this._getSelectedIndex() ? 'true' : 'false');
    });
  }

  /**
   * Sets focus to the navigation button at the specified index.
   *
   * This method programmatically focuses the button corresponding to the given index,
   * ensuring that keyboard users receive visual and functional feedback when navigating
   * through carousel items using arrow keys.
   *
   * @param index - The index of the button to focus within the navigation list.
   */
  private _focusButton(index: number): void {
    const buttons = this._navButtons?.toArray();

    const button = buttons?.[index].nativeElement;
    if (button) {
      button.focus();
    }
  }

  /**
   * Emits a navigation event with previous and current index and items.
   *
   * Allows external components to react to navigation changes with full context.
   *
   * @param previousIndex - The index before navigation.
   * @param previousItem - The item before navigation.
   * @param currentIndex - The index after navigation.
   * @param currentItem - The item after navigation.
   */
  private _emitNavigationEvent(
    previousIndex: number,
    previousItem: WhatsNewItem,
    currentIndex: number,
    currentItem: WhatsNewItem
  ): void {
    if (previousIndex !== currentIndex)
      this.navigation.emit({
        previousItem: {
          index: previousIndex,
          item: previousItem,
        },
        currentItem: {
          index: currentIndex,
          item: currentItem,
        },
      });
  }

  private _emitCompletedEvent(): void {
    this.close(true); // Force close the dialog as all items have been viewed
    this.completed.emit();
  }

  /**
   * Registers keyboard event listener when the dialog opens.
   */
  private _registerKeyboardListener(): void {
    if (this._options.enableKeyboardNavigation) {
      this.keyboardEventSubscription = fromEvent<KeyboardEvent>(window, 'keydown').subscribe(
        event => this._handleKeyboardNavigation(event)
      );
    }
  }

  /**
   * Unregisters keyboard event listener when the dialog closes.
   */
  private _unregisterKeyboardListener(): void {
    if (this.keyboardEventSubscription) {
      this.keyboardEventSubscription.unsubscribe();
      this.keyboardEventSubscription = undefined;
    }
  }
}
