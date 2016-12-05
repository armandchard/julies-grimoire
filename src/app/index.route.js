(function () {
  'use strict';

  angular
    .module('mbc')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('index', {
        abstract: true,
        url: '/index',
        templateUrl: 'app/components/common/content_top_navigation.html',
        resolve: {
          "currentAuth": ["Auth", function (Auth) {
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('index.profile', {
        url: '/profile',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Profile view',
          requiresLogin: true
        }
      })
      .state('index.product', {
        url: '/product',
        templateUrl: 'app/product/product.html',
        controller: 'ProductController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products list',
          requiresLogin: true
        }
      })
      .state('index.product-details', {
        url: '/product/:id',
        templateUrl: 'app/product/product-details.html',
        controller: 'ProductDetailsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Product details',
          requiresLogin: true
        }
      })
      .state('index.stock', {
        url: '/stock',
        templateUrl: 'app/stock/stock.html',
        controller: 'StockController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Stock view',
          requiresLogin: true
        }
      })
      .state('index.box', {
        url: '/box',
        templateUrl: 'app/box/box.html',
        controller: 'BoxController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Box view',
          requiresLogin: true
        }
      })
      .state('index.refill', {
        url: '/refill',
        templateUrl: 'app/refill/refill.html',
        controller: 'RefillController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Refill view',
          requiresLogin: true
        }
      })
      .state('index.print-refill', {
        url: '/refill/:id/print',
        templateUrl: 'app/refill/print-refill.html',
        controller: 'RefillController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Refill print',
          requiresLogin: true
        }
      })
      .state('index.admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Admin',
          needAdmin: true
        }
      })
      .state('index.admin-user', {
        url: '/admin/users/:id',
        templateUrl: 'app/admin/admin-user.html',
        controller: 'BrandController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Admin users',
          needAdmin: true
        }
      })
      .state('index.sales', {
        url: '/sales',
        templateUrl: 'app/sale/sale.html',
        controller: 'SaleController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sales view',
          requiresLogin: true
        }
      })
      .state('index.notification', {
        url: '/notifications',
        templateUrl: 'app/notification/notification.html',
        controller: 'NotificationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'user\'s notifications',
          needAdmin: true
        }
      })
    $urlRouterProvider.otherwise('/login');
  }

})();
