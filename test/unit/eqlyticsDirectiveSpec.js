describe('eqlytics analytics-on directive', function () {
  var element;
  var $scope;
  var eqlytics;

  beforeEach(function() {
    module('eqlytics');

    inject(function($compile, $rootScope, _eqlytics_) {
      eqlytics = _eqlytics_;

      $scope = $rootScope.$new();
      element = angular.element(
        "<button analytics-on " +
                "analytics-event='eventName' " +
                "analytics-property-a='value A' " +
                "analytics-property-b='value B'>Text</button>");
      $compile(element)($scope);
      $scope.$digest();
    });
  });

  it('should trigger an event in eqlytics', function () {
    spyOn(eqlytics, 'track');
    element[0].click();
    expect(eqlytics.track).toHaveBeenCalled();
  });
});
