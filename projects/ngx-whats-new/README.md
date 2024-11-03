# NgxWhatsNew

Ngx-whats-new is an angular module with a multi-modal component that is typically used to present new features of your application.

![ngx-whats-new screencast](screencast.gif)

```
    npm i ngx-whats-new
```

## Usage example:

[Codesandbox example](https://codesandbox.io/s/ngx-whats-new-demo-nxc8b?file=/src/main.ts)

Import the component:

```typescript
import { NgModule } from '@angular/core';
import { NgxWhatsNewComponent } from 'ngx-whats-new';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [NgxWhatsNewComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Use `<ngx-whats-new>` in your component:

app.component.html

```html
<button (click)="openDialog()">Open Dialog</button>

<ngx-whats-new
  #whatsNew
  (opened)="onOpen()"
  (closed)="onClose()"
  (navigation)="onNavigation($event)"
  [items]="modals"
  [options]="options" />
```

app.component.ts

```typescript
    @ViewChild('whatsNew') private readonly modal?: NgxWhatsNewComponent;

    /** Options for the modal */
    public options: DialogOptions = {
      enableKeyboardNavigation: true,
      clickableNavigationDots: true,
      disableClose: false,
    };

    /** Definition of all modals to show */
    modals = [
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
      ...
    ];

    public openDialog(): void {
      this.modal?.open();
    }

    public onOpen(): void {
      console.log('Dialog opened');
    }

    public onClose(): void {
      console.log('Dialog closed');
    }

    public onNavigation($event: NavigationEvent) {
      console.info('Previous item:', $event.previousItem);
      console.info('Current item:', $event.currentItem);
    }
```

> [!NOTE]
> Optionally, you could use `@if` to conditionally render the component. This is useful if you want to make sure the dialog state is fully reset.
>
> app.component.html
>
> ```html
> @if (isDialogVisible) {
> <ngx-whats-new
>   #whatsNew
>   (opened)="onOpen()"
>   (closed)="onClose()"
>   (navigation)="onNavigation($event)"
>   [items]="modals"
>   [options]="options" />
> }
> ```
>
> app.component.ts
>
> ```typescript
>   public isDialogVisible: boolean | undefined;
>
>   public openDialog(): void {
>     isDialogVisible = true;
>   }
>
>   public onClose(): void {
>     isDialogVisible = false;
>   }
> ```

## Available Options:

General options:

```typescript
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
```

Options of a single modal window:

```typescript
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
```

## Theming

You can customize the look and feel of the dialog by overriding the CSS variables exposed by the component. The following variables are available and these are their default values:

```css
:host {
  /* Global variables */
  --wn-base-font-size: 16px;
  --wn-base-font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  /* Button focus outline */
  --wn-button-focus-outline-color: #1276d3;
  --wn-button-focus-outline-width: 2px;
  --wn-button-focus-outline-style: solid;
  --wn-button-focus-outline-offset: 2px;

  /* Main button */
  --wn-main-button-background-color: #661020;
  --wn-main-button-color: #fdfdfd;
  --wn-main-button-border: none;
  --wn-main-button-padding: 0.7em 2.5em;
  --wn-main-button-border-radius: 4px;
  --wn-main-button-text-transform: uppercase;
  /* hover state */
  --wn-main-button-hover-opacity: 0.9;
  --wn-main-button-hover-color: #fdfdfd;
  --wn-main-button-hover-background-color: #661020;
  /* active state */
  --wn-main-button-active-opacity: 1;
  --wn-main-button-active-color: #fdfdfd;
  --wn-main-button-active-background-color: #731d2d;

  /* Close button */
  --wn-close-button-background-color: rgba($color: #292929, $alpha: 0.5);
  --wn-close-button-color: #fdfdfd;
  --wn-close-button-border: none;
  --wn-close-button-border-radius: 100%;
  --wn-close-button-top: 0.5em;
  --wn-close-button-right: 0.5em;
  --wn-close-button-left: auto;
  --wn-close-button-bottom: auto;
  --wn-close-button-z-index: 10;

  /* Image */
  --wn-image-background: #eaeaea;
  --wn-image-box-shadow: '0px -1px 5px 5px rgb(0 0 0 / 5%), 0px -1px 8px 5px rgb(0 0 0 / 12%)';
  --wn-image-placeholder-background: #292929;
  --wn-image-loader-color: #731d2d;

  /* Modal container */
  --wn-modal-container-z-index: 1000;

  /* Modal */
  --wn-modal-background-color: #f4f4f4;
  --wn-modal-box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
  --wn-modal-border-radius: 4px;

  /* Navigation dots */
  --wn-nav-dot-background-color: transparent;
  --wn-nav-dot-border-radius: 100%;
  --wn-nav-dot-border: 1px solid rgba(0, 0, 0, 0.3);
  /* hover state */
  --wn-nav-dot-hover-background-color: rgba(0, 0, 0, 0.1);
  /* active state */
  --wn-nav-dot-active-background-color: #731d2d;
  --wn-nav-dot-active-border: 1px solid #661020;

  /* Title */
  --wn-title-font-weight: 600;
  --wn-title-color: #292929;
  --wn-title-text-align: center;

  /* Text */
  --wn-text-color: #525252;
  --wn-text-text-align: center;
  --wn-text-font-weight: 400;

  /* Link */
  --wn-text-link-color: #1276d3;
  --wn-text-link-text-decoration: underline;
  --wn-text-link-hover-color: #499ae7;

  /* Backdrop */
  --wn-backdrop-filter: blur(3px);
  --wn-backdrop-z-index: -1;
  --wn-backdrop-color: rgba(0, 0, 0, 0.3);
}
```

### Making your own theme

To make your own theme, you can copy the CSS rule above with the variables you want to override and add them to your own CSS or SCSS file. Then, change the `:host` selector to the selector of the component, `ngx-whats-new`. For example:

```scss
/* my-styles.scss */

ngx-whats-new {
  /* Global variables */
  --wn-base-font-size: 14px;
  --wn-base-font-family: 'Helvetica', 'Arial', sans-serif;

  /* Title */
  --wn-title-color: #0987d5;
  --wn-title-text-align: left;

  /* Text */
  --wn-text-color: #000000;
  --wn-text-text-align: left;
}

// Any other SCSS rules for your app
// ...
```

> [!WARNING]
> **Some variables are exposed but not meant to be overridden.** These variables are prefixed with an underscore (`_`). For example, `--_body-spacing` is exposed but not meant to be overridden. The component uses these variables in media queries to adapt the layout of the dialog to different screen sizes. **Overriding these variables could lead to unexpected results.**
