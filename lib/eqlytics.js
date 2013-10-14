(function(angular) {
'use strict';

angular.module('eqlytics', []).

  service('eqlytics', function() {
    this.identify = function() {
      window.analytics.identify.apply(this, arguments);
    };

    this.track = function() {
      window.analytics.track.apply(this, arguments);
    };

    this.pageview = function() {
      window.analytics.pageview.apply(this, arguments);
    };
  })

  .run(['$rootScope', 'eqlytics', function ($rootScope, eqlytics) {
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
      if (current && (current.$$route || current).redirectTo) {
        return;
      }
      eqlytics.pageview(window.location.pathname + window.location.hash);
    });
  }])

  // Adapted from https://github.com/luisfarzati/angulartics/blob/master/src/angulartics.js
  .directive('analyticsOn', ['eqlytics', function (eqlytics) {
    function inferEventName(element) {
      if (isCommand(element)) return element.innerText || element.value;
      return element.id || element.name || element.tagName;
    }

    function isProperty(name) {
      return name.substr(0, 9) === 'analytics' && ['on', 'event'].indexOf(name.substr(10)) === -1;
    }

    return {
      restrict: 'A',
      scope: false,
      link: function ($scope, $element, $attrs) {
        var eventType = $attrs.analyticsOn || 'click',
            eventName = $attrs.analyticsEvent || inferEventName($element[0]);

        var properties = {};
        angular.forEach($attrs.$attr, function(attr, name) {
          if (isProperty(attr)) {
            properties[name.slice(9).toLowerCase()] = $attrs[name];
          }
        });

        angular.element($element[0]).bind(eventType, function () {
          eqlytics.track(eventName, properties);
        });
      }
    };
  }]);

})(window.angular);
