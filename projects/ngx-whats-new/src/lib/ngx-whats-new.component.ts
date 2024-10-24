import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
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
export class NgxWhatsNewComponent {
  /** Global options */
  private _options: Options = DEFAULT_OPTIONS;

  /** Modals to show */
  @Input() items: ModalWindow[] = [];

  /** Set some default options */
  @Input() set options(options: Options) {
    this._options = { ...options };
  }
  get options() {
    return this._options;
  }

  /** Emits on close */
  @Output() closeModal = new EventEmitter<void>();

  /** Index of the selected modal item */
  selected = 0;

  /**
   * Registers a listener for keyboard-based navigation between modals
   * @param $event keyboard event
   */
  @HostListener('window:keydown', ['$event'])
  navigateByKeyboard($event: KeyboardEvent): void {
    if (this._options.enableKeyboardNavigation) {
      switch ($event.key) {
        case 'ArrowRight':
          if (this.selected < this.items.length - 1) {
            this.selected = this.selected + 1;
          }
          break;
        case 'ArrowLeft':
          if ($event.key === 'ArrowLeft' && this.selected > 0) {
            this.selected = this.selected - 1;
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
  handleEscape() {
    this.close();
  }

  /**
   * Navigates to the next modal
   */
  goToNext(): void {
    if (this.selected < this.items.length - 1) {
      this.selected = this.selected + 1;
    } else {
      this.closeModal.emit();
    }
  }

  /**
   * Navigates to the modal with the provided index
   * @param index number of the modal window
   */
  navigateTo(index: number): void {
    if (this._options.clickableNavigationDots) {
      this.selected = index;
    }
  }

  /**
   * Closes the modal dialog
   */
  close(): void {
    if (!this._options.disableClose) {
      this.closeModal.emit();
    }
  }
}
