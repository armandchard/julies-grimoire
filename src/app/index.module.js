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
      // 'ngCsvImport',
      'angular-ladda',
      'ui.footable',
      // 'toastr',
      'localytics.directives',
      'datatables',
      'textAngular',
      'flow',
      // 'ui.utils.masks',
      'firebase',
      // 'AngularPrint',
      'angularMoment',
      'angular-flot',
      // 'angularTinycon',
      'tmh.dynamicLocale',
      'ngLodash',

      //////

      'mbc.core',
      'mbc.auth',
      'mbc.sale',
      // 'mbc.admin',
      'mbc.layout',
      // 'mbc.stock',
      // 'mbc.refill',
      // 'mbc.profile',
      // 'mbc.product'
    ]);

})();
