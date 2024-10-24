import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { ModalWindow } from './modal-window.interface';
import { Options } from './options.interface';

const DEFAULT_OPTIONS: Options = {
  customStyle: {
    width: '500px',
  },
  disableClose: false,
};

@Component({
  selector: 'ngx-whats-new',
  templateUrl: './ngx-whats-new.component.html',
  styleUrls: ['./ngx-whats-new.component.scss'],
})
export class NgxWhatsNewComponent implements AfterViewInit {
  /** Options item initialized with default values. Accepts custom values. */
  private _options: Options = DEFAULT_OPTIONS;

  /** Items to show in the dialog */
  @Input() items: ModalWindow[] = [];

  /** Control whether the dialog is visible */
  protected isVisible = false;

  /** Options for What's New dialog */
  @Input() set options(options: Options) {
    this._options = { ...options };
  }
  get options() {
    return this._options;
  }

  /** Event emitted on dialog close */
  @Output() private readonly closeModal = new EventEmitter<void>();

  /** Reference to the close button */
  @ViewChild('wnCloseButton') private readonly _closeButton?: ElementRef;

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
      switch ($event.key) {
        case 'ArrowRight':
          if (this.selectedIndex < this.items.length - 1) {
            this.selectedIndex = this.selectedIndex + 1;
          }
          break;
        case 'ArrowLeft':
          if ($event.key === 'ArrowLeft' && this.selectedIndex > 0) {
            this.selectedIndex = this.selectedIndex - 1;
          }
          break;
        case 'Escape':
          this.close();
          break;
        default:
          break;
      }
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
    }
  }

  /** Opens What's New dialog. */
  public open(): void {
    this.isVisible = true;
  }

  /** Closes What's New dialog. */
  public close(): void {
    if (!this._options.disableClose) {
      this.isVisible = false;
      this.closeModal.emit();
    }
  }
}
