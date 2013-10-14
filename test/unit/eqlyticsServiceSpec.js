'use strict';

var service;
var segmentioMock;

describe('eqlytics', function() {

  beforeEach(function() {
    module('eqlytics');

    segmentioMock = {
      identify: function() {},
      track: function() {},
      pageview: function() {}
    };
    // In real life, the segment.io library gets assigned to window.anlytics in index.html.
    window.analytics = segmentioMock;

    inject(function(_eqlytics_) {
      service = _eqlytics_;
    });
  });

  it('should be defined', function() {
    expect(service).toBeDefined();
  });

  it('should pass identify calls to segmentio', function() {
    spyOn(segmentioMock, 'identify');
    service.identify(123, { name: 'John', company: 'Split Image' });

    expect(segmentioMock.identify)
      .toHaveBeenCalledWith(123, { name: 'John', company: 'Split Image' });
  });

  it('should pass track calls to segmentio', function() {
    spyOn(segmentioMock, 'track');
    service.track('myEvent', { truth: 42 });

    expect(segmentioMock.track)
      .toHaveBeenCalledWith('myEvent', { truth: 42 });
  });

  it('should pass pageview calls to segmentio', function() {
    spyOn(segmentioMock, 'pageview');
    service.pageview('/upgrade');

    expect(segmentioMock.pageview)
      .toHaveBeenCalledWith('/upgrade');
  });

  describe('automatic pageview tracking', function() {
    var rootScope;

    beforeEach(function() {
      inject(function(_$rootScope_) {
        rootScope = _$rootScope_;
      });
    });

    it('should track on route change', function() {
      var currentPage = window.location.pathname;

      spyOn(service, 'pageview');
      rootScope.$emit('$routeChangeSuccess');

      expect(service.pageview).toHaveBeenCalledWith(currentPage);
    });
  });
});
