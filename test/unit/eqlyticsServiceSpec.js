'use strict';

var service;
var segmentioMock;

describe('eqlytics', function() {

  beforeEach(function() {
    module('eqlytics');

    segmentioMock = {
      identify: function() {},
      track: function() {},
      page: function() {},
      alias: function() {}
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
    spyOn(segmentioMock, 'page');
    service.pageview('/upgrade');

    expect(segmentioMock.page)
      .toHaveBeenCalledWith({path: '/upgrade'});
  });

  it('should pass alias calls to segmentio', function() {
    spyOn(segmentioMock, 'alias');
    service.alias('123');

    expect(segmentioMock.alias)
      .toHaveBeenCalledWith('123');
  });

  it('should not pass any calls to segmentio when muted', function(){
    spyOn(segmentioMock, 'alias');
    spyOn(segmentioMock, 'page');
    spyOn(segmentioMock, 'track');
    spyOn(segmentioMock, 'identify');

    service.mute();

    service.alias('123');
    service.pageview('/upgrade');
    service.track('myEvent', { truth: 42 });
    service.identify(123, { name: 'John', company: 'Split Image' });

    expect(segmentioMock.alias)
      .not.toHaveBeenCalled();
    expect(segmentioMock.page)
      .not.toHaveBeenCalled();
    expect(segmentioMock.track)
      .not.toHaveBeenCalled();
    expect(segmentioMock.identify)
      .not.toHaveBeenCalled();
  });

  it('should log calls to service functions without propagation to segmentio when configured by call to "logOnly" method', function() {
    spyOn(segmentioMock, 'alias');
    spyOn(segmentioMock, 'page');
    spyOn(segmentioMock, 'track');
    spyOn(segmentioMock, 'identify');
    spyOn(console, 'log');

    service.logOnly();

    service.alias('123');
    expect(console.log.mostRecentCall.args)
      .toEqual(['[eqlytics]', 'alias', angular.toJson(['123'])]);
    expect(segmentioMock.alias)
      .not.toHaveBeenCalled();

    service.pageview('/upgrade');
    expect(console.log.mostRecentCall.args)
      .toEqual(['[eqlytics]', 'pageview', angular.toJson(['/upgrade'])]);
    expect(segmentioMock.page)
      .not.toHaveBeenCalled();

    service.track('myEvent', { truth: 42 });
    expect(console.log.mostRecentCall.args)
      .toEqual(['[eqlytics]', 'track', angular.toJson(['myEvent', { truth: 42 }])]);
    expect(segmentioMock.track)
      .not.toHaveBeenCalled();


    service.identify(123, { name: 'John', company: 'Split Image' });
    expect(console.log.mostRecentCall.args)
      .toEqual(['[eqlytics]', 'identify', angular.toJson([123, { name: 'John', company: 'Split Image' }])]);
    expect(segmentioMock.identify)
      .not.toHaveBeenCalled();
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
