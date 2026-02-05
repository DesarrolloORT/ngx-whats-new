/**
 * Unit tests for AngularJS What's New Directive
 *
 * Basic test suite for the whatsNew directive.
 * 
 * @module whatsNew.tests
 */
describe('whatsNew directive', function () {
  'use strict';

  var $compile, $rootScope, $timeout, element, scope;

  // Mock items for testing
  var mockItems = [
    {
      title: 'Whats new in v1.0.0',
      html: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.<br /><a href="http://google.com">test</a> ',
      image: {
        src: 'https://picsum.photos/500',
        altText: 'In v1.0.0, lorem ipsum dolor sit amet.',
      },
      button: {
        text: 'Okay',
        position: 'center',
      },
    },
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
      button: {
        text: 'Got it!',
        position: 'center',
      },
    },
    {
      image: {
        src: 'https://picsum.photos/500/500',
        altText: 'Lorem ipsum dolor sit amet.',
      },
      text: 'Very interesting feature',
      button: {
        text: 'Got it',
        position: 'center',
      },
    },
  ];

  // Load the whatsNew module
  beforeEach(module('whatsNew'));

  // Inject dependencies
  beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  // Setup test scope
  beforeEach(function () {
    scope = $rootScope.$new();
    scope.items = mockItems;
    scope.options = {
      clickableNavigationDots: true,
      enableKeyboardNavigation: true,
      disableClose: false,
    };
  });

  // Cleanup after each test
  afterEach(function () {
    if (element) {
      element.remove();
    }
    scope.$destroy();
  });

  describe('Initialization and configuration', function () {
    it('should create directive element', function () {
      element = $compile('<whats-new items="items" options="options"></whats-new>')(scope);
      scope.$digest();

      expect(element).toBeDefined();
      expect(element.length).toBe(1);
    });

    it('should initialize with items', function () {
      element = $compile('<whats-new items="items" options="options"></whats-new>')(scope);
      scope.$digest();

      var isolateScope = element.isolateScope();
      expect(isolateScope.vm.items).toBeDefined();
      expect(isolateScope.vm.items.length).toBe(3);
    });

    it('should apply default options when not provided', function () {
      element = $compile('<whats-new items="items"></whats-new>')(scope);
      scope.$digest();

      var isolateScope = element.isolateScope();
      expect(isolateScope.vm._options).toBeDefined();
      expect(isolateScope.vm._options.clickableNavigationDots).toBe(true);
      expect(isolateScope.vm._options.enableKeyboardNavigation).toBe(true);
    });
  });

  describe('Visibility and display', function () {
    beforeEach(function () {
      element = $compile('<whats-new items="items" options="options"></whats-new>')(scope);
      scope.$digest();
    });

    it('should start as hidden', function () {
      var isolateScope = element.isolateScope();
      expect(isolateScope.vm._isVisible).toBe(false);
      expect(element.css('display')).toBe('none');
    });

    it('should become visible when opened', function () {
      var isolateScope = element.isolateScope();
      isolateScope.vm.open();
      scope.$digest();

      expect(isolateScope.vm._isVisible).toBe(true);
    });
  });

  describe('Navigation', function () {
    beforeEach(function () {
      element = $compile('<whats-new items="items" options="options"></whats-new>')(scope);
      scope.$digest();
    });

    it('should start at first item', function () {
      var isolateScope = element.isolateScope();
      expect(isolateScope.vm._selectedIndex).toBe(0);
    });

    it('should navigate to next item', function () {
      var isolateScope = element.isolateScope();
      isolateScope.vm.next();
      scope.$digest();

      expect(isolateScope.vm._selectedIndex).toBe(1);
    });

    it('should navigate to previous item', function () {
      var isolateScope = element.isolateScope();
      isolateScope.vm.next();
      scope.$digest();
      isolateScope.vm.previous();
      scope.$digest();

      expect(isolateScope.vm._selectedIndex).toBe(0);
    });
  });
});
