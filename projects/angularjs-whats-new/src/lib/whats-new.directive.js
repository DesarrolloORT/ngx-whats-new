/**
 * AngularJS What's New Directive
 *
 * A directive that creates a multi-modal dialog for presenting new features.
 *
 * @directive whatsNew
 */
(function () {
  'use strict';

  angular.module('whatsNew').directive('whatsNew', whatsNewDirective);

  /**
   * What's New directive definition
   * @returns {Object} Directive definition object
   */
  function whatsNewDirective() {
    return {
      restrict: 'E',
      scope: {
        items: '=',
        options: '=?',
        onOpened: '&?',
        onClosed: '&?',
        onNavigation: '&?',
        onCompleted: '&?',
      },
      templateUrl: 'whats-new.template.html',
      controller: WhatsNewController,
      controllerAs: 'vm',
      bindToController: true,
      link: linkFunction,
    };
  }

  /**
   * Link function for the directive
   * @param {Object} scope - Angular scope
   * @param {Object} element - Directive element
   * @param {Object} attrs - Element attributes
   * @param {Object} ctrl - Controller instance
   */
  function linkFunction(scope, element, attrs, ctrl) {
    // Initialize component as hidden
    element.css('display', 'none');

    // Store element reference for controller
    ctrl._element = element;

    // Handle keyboard navigation
    function handleKeydown(event) {
      if (ctrl._options.enableKeyboardNavigation) {
        scope.$apply(function () {
          ctrl.handleKeyboardNavigation(event);
        });
      }
    }

    // Register/unregister keyboard listener
    ctrl._registerKeyboardListener = function () {
      if (ctrl._options.enableKeyboardNavigation) {
        angular.element(window).on('keydown', handleKeydown);
      }
    };

    ctrl._unregisterKeyboardListener = function () {
      angular.element(window).off('keydown', handleKeydown);
    };

    // Cleanup on destroy
    scope.$on('$destroy', function () {
      ctrl._unregisterKeyboardListener();
    });
  }

  // Inject dependencies
  WhatsNewController.$inject = ['$scope', '$timeout', '$sce'];

  /**
   * What's New Controller
   * @param {Object} $scope - Angular scope
   * @param {Object} $timeout - Angular timeout service
   * @param {Object} $sce - Angular Strict Contextual Escaping service
   */
  function WhatsNewController($scope, $timeout, $sce) {
    var vm = this;

    // Default options
    var DEFAULT_OPTIONS = {
      clickableNavigationDots: true,
      enableKeyboardNavigation: true,
      disableClose: true,
    };

    // Private state
    vm._isVisible = false;
    vm._imageHasLoaded = false;
    vm._selectedIndex = 0;
    vm._contentAnimationState = 0;
    vm._element = null;
    vm._options = angular.extend({}, DEFAULT_OPTIONS);

    // Initialize
    vm.$onInit = function () {
      // Merge options with defaults
      if (vm.options) {
        vm._options = angular.extend({}, DEFAULT_OPTIONS, vm.options);
      }

      // Process items
      if (vm.items && vm.items.length > 0) {
        vm._items = vm.items;
      } else {
        console.warn('WhatsNew: No items provided.');
        vm._items = [];
      }

      resetState();
    };

    // Watch for changes in options
    $scope.$watch(
      'vm.options',
      function (newOptions) {
        if (newOptions) {
          vm._options = angular.extend({}, DEFAULT_OPTIONS, newOptions);
        }
      },
      true
    );

    // Watch for changes in items
    $scope.$watch('vm.items', function (newItems) {
      if (newItems && newItems.length > 0) {
        vm._items = newItems;
      } else {
        vm._items = [];
      }
      resetState();
    });

    // Public API

    /**
     * Opens the What's New dialog
     */
    vm.open = function () {
      $timeout(function () {
        if (vm._element) {
          vm._element.css('display', 'block');
        }
        vm._isVisible = true;
        if (vm.onOpened) {
          vm.onOpened();
        }
        if (vm._registerKeyboardListener) {
          vm._registerKeyboardListener();
        }
        resetState();
      });
    };

    /**
     * Closes the What's New dialog
     * @param {boolean} forceClose - Forces the dialog to close even if disableClose is true
     */
    vm.close = function (forceClose) {
      if (!vm._options.disableClose || forceClose) {
        if (vm._element) {
          vm._element.css('display', 'none');
        }
        if (vm._unregisterKeyboardListener) {
          vm._unregisterKeyboardListener();
        }
        vm._isVisible = false;
        if (vm.onClosed) {
          vm.onClosed();
        }
        resetState();
      }
    };

    /**
     * Navigates to the next item. Closes dialog if it is the last one.
     */
    vm.goToNext = function () {
      if (vm._items.length === 0) {
        console.warn('WhatsNew: No items to navigate.');
        return;
      }

      var previousIndex = vm._selectedIndex;
      var previousItem = vm._items[previousIndex];

      if (previousIndex < vm._items.length - 1) {
        setSelectedIndex(previousIndex + 1);
        var currentIndex = vm._selectedIndex;
        var currentItem = vm._items[currentIndex];

        emitNavigationEvent(previousIndex, previousItem, currentIndex, currentItem);
      } else {
        emitCompletedEvent();
      }
    };

    /**
     * Navigates to the item at the specified index
     * @param {number} index - Index of the item to navigate to
     */
    vm.navigateTo = function (index) {
      if (vm._items.length === 0) {
        console.warn('WhatsNew: No items to navigate.');
        return;
      }

      var previousIndex = vm._selectedIndex;
      var previousItem = vm._items[previousIndex];

      if (vm._options.clickableNavigationDots && index !== previousIndex) {
        setSelectedIndex(index);
        var currentIndex = vm._selectedIndex;
        var currentItem = vm._items[currentIndex];

        emitNavigationEvent(previousIndex, previousItem, currentIndex, currentItem);
      }
    };

    /**
     * Handles image load event
     */
    vm.onImageLoad = function () {
      vm._imageHasLoaded = true;
    };

    /**
     * Handles image error event
     */
    vm.onImageError = function () {
      vm._imageHasLoaded = false;
      console.warn('WhatsNew: Image failed to load.');
    };

    /**
     * Gets the current selected item
     * @returns {Object} The currently selected item
     */
    vm.getSelectedItem = function () {
      return vm._items[vm._selectedIndex] || {};
    };

    /**
     * Gets trust HTML for safe rendering
     * @param {string} html - HTML string to trust
     * @returns {Object} Trusted HTML
     */
    vm.trustHtml = function (html) {
      return $sce.trustAsHtml(html);
    };

    /**
     * Handles keyboard navigation
     * @param {Object} event - Keyboard event
     */
    vm.handleKeyboardNavigation = function (event) {
      if (!vm._options.enableKeyboardNavigation) {
        return;
      }

      var nextIndex = vm._selectedIndex;
      switch (event.key || event.keyCode) {
        case 'ArrowRight':
        case 39:
          if (nextIndex < vm._items.length - 1) {
            nextIndex++;
          } else {
            emitCompletedEvent();
            return;
          }
          break;
        case 'ArrowLeft':
        case 37:
          if (nextIndex > 0) {
            nextIndex--;
          } else {
            return;
          }
          break;
        case 'Escape':
        case 27:
          vm.close();
          return;
        default:
          return;
      }

      if (nextIndex !== vm._selectedIndex) {
        var previousIndex = vm._selectedIndex;
        var previousItem = vm._items[previousIndex];
        setSelectedIndex(nextIndex);
        emitNavigationEvent(previousIndex, previousItem, nextIndex, vm._items[nextIndex]);
        event.preventDefault();
      }
    };

    // Private methods

    /**
     * Sets the selected index and updates animation state
     * @param {number} index - The new selected index
     */
    function setSelectedIndex(index) {
      vm._selectedIndex = index;
      vm._imageHasLoaded = false;
      // Toggle animation state to trigger re-animation
      vm._contentAnimationState = vm._contentAnimationState === 0 ? 1 : 0;
    }

    /**
     * Resets the component state
     */
    function resetState() {
      setSelectedIndex(0);
    }

    /**
     * Emits navigation event
     * @param {number} previousIndex - Previous item index
     * @param {Object} previousItem - Previous item
     * @param {number} currentIndex - Current item index
     * @param {Object} currentItem - Current item
     */
    function emitNavigationEvent(previousIndex, previousItem, currentIndex, currentItem) {
      if (previousIndex !== currentIndex && vm.onNavigation) {
        vm.onNavigation({
          $event: {
            previousItem: {
              index: previousIndex,
              item: previousItem,
            },
            currentItem: {
              index: currentIndex,
              item: currentItem,
            },
          },
        });
      }
    }

    /**
     * Emits completed event and closes the dialog
     */
    function emitCompletedEvent() {
      vm.close(true); // Force close the dialog
      if (vm.onCompleted) {
        vm.onCompleted();
      }
    }
  }
})();
