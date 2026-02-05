# AngularJS What's New

An AngularJS (1.x) module with a multi-modal component that is typically used to present new features of your application.

## Installation

### NPM (Recommended)

```bash
npm install angularjs-whats-new
```

### Manual Installation

Copy the files from `dist/` directory to your project:
- `angularjs-whats-new.js` - Combined module (includes template)
- `angularjs-whats-new.css` - Component styles

## Usage

### 1. Include the files in your HTML

**If installed via NPM:**
```html
<link rel="stylesheet" href="node_modules/angularjs-whats-new/dist/angularjs-whats-new.css">
<script src="node_modules/angular/angular.min.js"></script>
<script src="node_modules/angularjs-whats-new/dist/angularjs-whats-new.js"></script>
```

**If using a bundler (Webpack, Browserify, etc.):**
```javascript
// In your main JavaScript file
require('angularjs-whats-new/dist/angularjs-whats-new.css');
require('angularjs-whats-new');
```

**Manual installation:**
```html
<link rel="stylesheet" href="path/to/angularjs-whats-new.css">
<script src="path/to/angular.min.js"></script>
<script src="path/to/angularjs-whats-new.js"></script>
```

### 2. Add the module as a dependency

```javascript
angular.module('myApp', ['whatsNew']);
```

### 3. Use the directive in your template

```html
<whats-new
  items="vm.modals"
  options="vm.options"
  on-opened="vm.onOpen()"
  on-closed="vm.onClose()"
  on-navigation="vm.onNavigation($event)"
  on-completed="vm.onCompleted()">
</whats-new>

<button ng-click="vm.openDialog()">Open Dialog</button>
```

### 4. Configure in your controller

```javascript
angular.module('myApp').controller('MainController', ['$scope', function($scope) {
  var vm = this;

  // Options for the modal
  vm.options = {
    enableKeyboardNavigation: true,
    clickableNavigationDots: true,
    disableClose: false
  };

  // Definition of all modals to show
  vm.modals = [
    {
      title: "What's new in v1.0.0",
      html: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.<br /><a href="http://google.com">test</a>',
      image: {
        src: 'https://picsum.photos/500',
        altText: 'In v1.0.0, lorem ipsum dolor sit amet.',
      },
      button: {
        text: 'Okay',
        position: 'center'
      }
    },
    {
      title: "What's new in v1.1.0",
      text: 'More awesome features!',
      button: {
        text: 'Got it',
        position: 'center'
      }
    }
  ];

  // Get the directive element reference
  var whatsNewElement = null;

  // After the view is ready, get the directive's controller
  $scope.$on('$viewContentLoaded', function() {
    // Alternative: Use element reference with directive API
    whatsNewElement = angular.element(document.querySelector('whats-new'));
  });

  vm.openDialog = function() {
    // Get the directive's isolate scope and call open()
    var scope = angular.element(document.querySelector('whats-new')).isolateScope();
    if (scope && scope.vm) {
      scope.vm.open();
    }
  };

  vm.onOpen = function() {
    console.log('Dialog opened');
  };

  vm.onClose = function() {
    console.log('Dialog closed');
  };

  vm.onNavigation = function($event) {
    console.info('Previous item:', $event.previousItem);
    console.info('Current item:', $event.currentItem);
  };

  vm.onCompleted = function() {
    console.log('All items viewed');
  };
}]);
```

## API

### Directive Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `items` | Array | Array of WhatsNewItem objects to display |
| `options` | Object | DialogOptions configuration object |
| `on-opened` | Function | Callback when dialog opens |
| `on-closed` | Function | Callback when dialog closes |
| `on-navigation` | Function | Callback when navigation occurs (receives $event) |
| `on-completed` | Function | Callback when all items have been viewed |

### DialogOptions

```javascript
{
  // Flag to enable/disable closing the dialog.
  // When true, forces the user to view all items before closing.
  // Default: true
  disableClose: boolean,

  // Flag to enable/disable keyboard navigation.
  // Default: true
  enableKeyboardNavigation: boolean,

  // Flag to enable/disable navigation by clicking on dots.
  // Default: true
  clickableNavigationDots: boolean,

  // Custom styles for the dialog
  customStyle: {
    maxWidth: string,  // Max width of the dialog
    border: string     // Border property
  }
}
```

### WhatsNewItem

```javascript
{
  title: string,      // Title of the item
  text: string,       // Text content
  html: string,       // HTML content (rendered with ng-bind-html)
  image: {
    src: string,        // Source URL of the image
    background: string, // Background color
    altText: string,    // Alt text for the image
    aspectRatio: string,// Aspect ratio (e.g., '16/9')
    objectFit: string   // CSS object-fit property
  },
  button: {
    text: string,       // Button text
    position: 'start' | 'center' | 'end'  // Button alignment
  }
}
```

### NavigationEvent

```javascript
{
  previousItem: {
    index: number,
    item: WhatsNewItem
  },
  currentItem: {
    index: number,
    item: WhatsNewItem
  }
}
```

## Theming

You can customize the look and feel by overriding the CSS variables. Add your custom styles after loading the component CSS:

```css
whats-new {
  /* Global variables */
  --wn-base-font-size: 14px;
  --wn-base-font-family: 'Helvetica', 'Arial', sans-serif;

  /* Main button */
  --wn-main-button-background-color: #0066cc;

  /* Title */
  --wn-title-color: #0987d5;
  --wn-title-text-align: left;

  /* Text */
  --wn-text-color: #000000;
  --wn-text-text-align: left;
}
```

See the CSS file for all available CSS variables.

## Keyboard Navigation

When `enableKeyboardNavigation` is enabled:
- **ArrowRight**: Navigate to next item
- **ArrowLeft**: Navigate to previous item
- **Escape**: Close the dialog (if `disableClose` is false)

## Browser Support

This module requires a browser with AngularJS 1.5+ support and CSS custom properties (CSS variables) support.

## Migration from Modern Angular (ngx-whats-new)

This is the AngularJS (1.x) version of the ngx-whats-new library. The main differences are:

1. **Module system**: Uses AngularJS module system instead of ES6 modules
2. **Directive vs Component**: Uses `directive()` instead of `@Component` decorator
3. **Template syntax**: Uses `ng-if`, `ng-repeat`, `ng-click` instead of `@if`, `@for`, `(click)`
4. **HTML binding**: Uses `ng-bind-html` with `$sce.trustAsHtml()` instead of `[innerHTML]`
5. **Events**: Uses `&` binding with callbacks instead of `@Output()` EventEmitters
6. **No Shadow DOM**: Styles are applied globally, requiring careful CSS scoping

## License

MIT
