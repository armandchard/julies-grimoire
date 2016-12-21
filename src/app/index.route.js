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
      .state('index.receipt', {
        url: '/receipts',
        templateUrl: 'app/receipt/receipt.html',
        controller: 'ReceiptController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Receipts view',
          requiresLogin: true
        }
      })
      .state('index.add-receipt', {
        url: '/receipt/add',
        templateUrl: 'app/receipt/add-receipt.html',
        controller: 'ReceiptDetailController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'New receipt',
          requiresLogin: true
        }
      })
      .state('index.edit-receipt', {
        url: '/receipt/:id/edit',
        templateUrl: 'app/receipt/add-receipt.html',
        controller: 'ReceiptDetailController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'New receipt',
          requiresLogin: true
        }
      })
      .state('index.ingredient', {
        url: '/ingredients',
        templateUrl: 'app/ingredient/ingredient.html',
        controller: 'IngredientController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Ingredients view',
          requiresLogin: true
        }
      })
      .state('index.category', {
        url: '/categories',
        templateUrl: 'app/category/category.html',
        controller: 'CategoryController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Categories view',
          requiresLogin: true
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
    $urlRouterProvider.otherwise('/login');
  }

})();
