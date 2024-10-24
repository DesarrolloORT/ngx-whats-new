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

  /** Reference to the close button */
  @ViewChild('wnCloseButton') private readonly _closeButton?: ElementRef;

  /** Index of the selected modal item */
  protected selectedIndex = 0;

  ngAfterViewInit(): void {
    if (this._closeButton) {
      this._closeButton.nativeElement.focus(); // Set focus to the close button
    }
  }

  /**
   * Registers a listener for keyboard-based navigation between modals
   * @param $event keyboard event
   */
  @HostListener('window:keydown', ['$event'])
  navigateByKeyboard($event: KeyboardEvent): void {
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
  handleEscape() {
    this.close();
  }

  /**
   * Navigates to the next modal
   */
  goToNext(): void {
    if (this.selectedIndex < this.items.length - 1) {
      this.selectedIndex = this.selectedIndex + 1;
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
      this.selectedIndex = index;
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
