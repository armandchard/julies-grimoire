(function() {
  'use strict';

  angular
    .module('mbc', [
      'ngAnimate',
      'ngCookies',
      'ngTouch',
      'ngSanitize',
      'ngMessages',
      'ngAria',
      'ngResource',
      'ui.router',
      'ui.bootstrap',
      'angular-ladda',
      'ui.footable',
      'slick',
      'toastr',
      'localytics.directives',
      'datatables',
      'textAngular',
      'flow',
      'firebase',
      'angularMoment',
      'angular-flot',
      'tmh.dynamicLocale',
      'ngLodash',

      //////

      'mbc.core',
      'mbc.auth',
      'mbc.layout',
      'mbc.category',
      'mbc.ingredient',
      'mbc.receipt'
      // 'mbc.profile',
      // 'mbc.product'
    ]);

})();
