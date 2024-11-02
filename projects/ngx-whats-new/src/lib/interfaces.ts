/**
 * Item to show in the dialog.
 */
export interface WhatsNewItem {
  /** Title of the item */
  title?: string;
  /** Text content */
  text?: string;
  /** HTML content */
  html?: string;
  image?: {
    /** Source of the image */
    src: string;
    /** Background color of the image. Shown if image isn't loaded or doesn't fill the container */
    background?: string;
    /** Alternative text for the image */
    altText: string;
    /** Aspect ratio of the image. Useful for responsive images */
    aspectRatio?: string;
    /** Object fit property of the image. Value is `cover` by default to fill image container. Set to contain to keep the aspect ratio. If `contain` is set, it is recommended to set the `background` property as the image won't fit completely the container */
    objectFit?: string;
  };
  /** Main action button show on the bottom of the dialog */
  button?: {
    /** Text of the button */
    text: string;
    /** Horizontal alignment of the button */
    position?: 'left' | 'center' | 'right';
  };
}

/**
 * Options for the dialog.
 */
export interface DialogOptions {
  /**
   * Flag to enable/disable closing the dialog.
   * When `true`, it forces the user to view all items before closing the dialog.
   *
   * Default: `true`
   */
  disableClose?: boolean;
  /**
   * Flag to enable/disable keyboard navigation.
   * Useful for accessibility purposes.
   *
   * Default: `true`
   */
  enableKeyboardNavigation?: boolean;
  /**
   * Flag to enable/disable navigation by clicking on the navigation dots.
   *
   * Default: `true`
   */
  clickableNavigationDots?: boolean;
  /**
   * Custom styles for the dialog.
   */
  customStyle?: {
    /** Max width of the dialog. **Only use when the dialog is not meant to be responsive** */
    maxWidth?: string;
    /** Border property of the dialog. Useful for accessibility purposes, i.e. improve contrast */
    border?: string;
  };
}

/**
 * Event emitted when the selected item changes.
 */
export interface NavigationEvent {
  /** Previous selected item */
  previousItem: NavigationItem | undefined;
  /** Current selected item */
  currentItem: NavigationItem;
}

/**
 * Item emitted when the selected item changes.
 */
interface NavigationItem {
  /** Index of the item */
  index: number;
  /** Item */
  item: WhatsNewItem;
}
