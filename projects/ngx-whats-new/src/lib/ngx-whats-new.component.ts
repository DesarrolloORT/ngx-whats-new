import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { DialogOptions, WhatsNewItem } from './interfaces';

const DEFAULT_OPTIONS: DialogOptions = {
  customStyle: {
    width: '500px',
  },
  disableClose: false,
};

@Component({
  selector: 'ngx-whats-new',
  standalone: true,
  imports: [CommonModule, A11yModule],
  templateUrl: './ngx-whats-new.component.html',
  styleUrls: ['./ngx-whats-new.component.scss'],
})
export class NgxWhatsNewComponent implements AfterViewInit {
  /** DialogOptions item initialized with default values. Accepts custom values. */
  private _options: DialogOptions = DEFAULT_OPTIONS;

  /** Items to show in the dialog */
  private _items: WhatsNewItem[] = [];

  /** Items to show in the dialog */
  @Input() set items(items: WhatsNewItem[]) {
    if (items) {
      this._items = items;
    }
  }
  get items(): WhatsNewItem[] {
    return this._items;
  }

  /** Control whether the dialog is visible */
  protected isVisible = false;

  /** DialogOptions for What's New dialog */
  @Input() set options(options: DialogOptions) {
    this._options = { ...options };
  }
  get options() {
    return this._options;
  }

  /** Event emitted on dialog close */
  @Output() private readonly closeModal = new EventEmitter<void>();

  /** Reference to the close button */
  @ViewChild('wnCloseButton') private readonly _closeButton?: ElementRef;

  /** Reference to the navigation buttons */
  @ViewChildren('wnNavButton')
  private readonly navButtons?: QueryList<ElementRef>;

  /** Index of the selected modal item */
  protected selectedIndex = 0;

  /**
   * Sets focus to the close button when the component is initialized.
   *
   * **USE NOT RECOMMENDED**
   */
  ngAfterViewInit(): void {
    if (this._closeButton) {
      this._closeButton.nativeElement.focus(); // Set focus to the close button
    }
  }

  /**
   * Registers a listener for keyboard-based navigation between items.
   *
   * Handled events:
   *  - ArrowRight: next item
   *  - ArrowLeft: previous item
   *  - Escape: close dialog
   * @param $event keyboard event
   */
  @HostListener('window:keydown', ['$event'])
  protected handleKeyboardNavigation($event: KeyboardEvent): void {
    if (this._options.enableKeyboardNavigation) {
      let nextIndex = this.selectedIndex;
      switch ($event.key) {
        case 'ArrowRight':
          if (this.selectedIndex < this.items.length - 1) {
            nextIndex = this.selectedIndex + 1;
          } else {
            this.close();
            return;
          }
          break;
        case 'ArrowLeft':
          if (this.selectedIndex > 0) {
            nextIndex = this.selectedIndex - 1;
          } else return;

          break;
        case 'Escape':
          this.close();
          break;
        default:
          break;
      }

      if (nextIndex !== this.selectedIndex) {
        this.selectedIndex = nextIndex;
        this.updateTabIndices();
        this.focusButton(this.selectedIndex);
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
  private updateTabIndices(): void {
    this.navButtons?.forEach((ref, index) => {
      const button = ref.nativeElement;
      button.tabIndex = index === this.selectedIndex ? 0 : -1;
      button.setAttribute(
        'aria-selected',
        index === this.selectedIndex ? 'true' : 'false'
      );
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
  private focusButton(index: number): void {
    const buttons = this.navButtons?.toArray();

    const button = buttons?.[index].nativeElement;
    if (button) {
      button.focus();
    }
  }

  /**
   * Registers a listener for Escape key to close the modal
   */
  @HostListener('document:keydown.escape', ['$event'])
  protected handleEscape() {
    this.close();
  }

  /** Navigates to the next item. Closes What's New dialog if it is the last one. */
  public goToNext(): void {
    if (this.selectedIndex < this.items.length - 1) {
      this.selectedIndex = this.selectedIndex + 1;
    } else {
      this.closeModal.emit();
    }
  }

  /**
   * Navigates to the item corresponding to the provided number.
   * @param index number of the item
   */
  public navigateTo(index: number): void {
    if (this._options.clickableNavigationDots) {
      this.selectedIndex = index;
      this.updateTabIndices();
      this.focusButton(index);
    }
  }

  /** Opens What's New dialog. */
  public open(): void {
    this.isVisible = true;
    this.resetState();
  }

  /** Closes What's New dialog. */
  public close(): void {
    if (!this._options.disableClose) {
      this.isVisible = false;
      this.closeModal.emit();
      this.resetState();
    }
  }

  /**
   * Resets the component's state to its initial values.
   *
   * This method is called when the dialog is opened or closed to ensure that
   * the component does not retain any state from previous interactions.
   */
  private resetState(): void {
    this.selectedIndex = 0;
    this.updateTabIndices();
  }
}
