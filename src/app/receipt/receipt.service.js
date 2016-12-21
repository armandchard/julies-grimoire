(function () {
  'use strict';

  angular
    .module('mbc.receipt')
    .service('receiptService', receiptService);

  receiptService.$inject = ['$q', '$filter', '$http', 'CONSTS', 'listService', 'authService', 'firebaseDataService', 'productService'];

  function receiptService($q, $filter, $http, CONSTS, listService, authService, firebaseDataService, productService) {
    var userProducts = [];

    var service = {
      getSales: getSales,
      getSalesCount: getSalesCount,
      loadProducts: loadProducts,
      products: userProducts
    };
    return service;

    function loadProducts() {
      var deferred = $q.defer();
      productService.getList()
        .then(function (data) {
          userProducts = data;
          deferred.resolve(userProducts);
        });
      return deferred.promise;
    }

    function getProducts(sales) {
      var deferred = $q.defer();
      getSalesCount(sales, userProducts)
        .then(function (products) {
          deferred.resolve(products);
        })
      return deferred.promise;
    }

    // function getProducts(sales) {
    //   var deferred = $q.defer();
    //   productService.getList()
    //     .then(function (data) {
    //       var userProducts = data;
    //       getSalesCount(sales, userProducts)
    //         .then(function (products) {
    //           deferred.resolve(products);
    //         })
    //     });
    //   return deferred.promise;
    // }

    // function getSales(date) {
    //   var deferred = $q.defer();
    //   listService.getRegisterSales($filter('date')(new Date(date.startDate), 'yyyy-MM-dd'))
    //     .then(function (data) {
    //       var sales = data.data;
    //       if (angular.isDefined(date) && angular.isDefined(date.startDate)) {
    //         sales = $filter('filter')(data.data, function (s) {
    //           return $filter('date')(new Date(s.created_at), 'yyyy-MM-dd') <= $filter('date')(new Date(date.endDate), 'yyyy-MM-dd');
    //         });
    //       }
    //       getProducts(sales)
    //         .then(function (products) {
    //           deferred.resolve(products);
    //         })
    //     });
    //   return deferred.promise;
    // }

    function getSales(date) {
      var salesList = [];
      var deferred = $q.defer();
      var request = CONSTS.apiUrl + '/sales?page=1';
      var query = '';
      if (angular.isDefined(date) && angular.isDefined(date.startDate)) {
        query = '&since=' + $filter('date')(new Date(date.startDate), 'yyyy-MM-dd');
      }
      $http.get(request + query)
        .then(function (data) {
          var promises = [];
          if (angular.isDefined(data.data.pagination)) {
            for (var i = 2; i <= data.data.pagination.pages; i++) {
              promises.push($http.get(CONSTS.apiUrl + '/sales?page=' + i + query));
            }
          }
          for (var j = 0; j < data.data.register_sales.length; j++) {
            salesList.push(data.data.register_sales[j]);
          }
          $q.all(promises)
            .then(function (responses) {
              for (var j = 0; j < responses.length; j++) {
                var register_sales = responses[j].data.register_sales;
                for (var i = 0; i < register_sales.length; i++) {
                  salesList.push(register_sales[i]);
                }
              }
            })
            .then(function () {
              var sales = $filter('filter')(salesList, function (s) {
                return $filter('date')(new Date(s.sale_date), 'yyyy-MM-dd') <= $filter('date')(new Date(date.endDate), 'yyyy-MM-dd') && $filter('date')(new Date(s.sale_date), 'yyyy-MM-dd') >= $filter('date')(new Date(date.startDate), 'yyyy-MM-dd');
              });
              getProducts(sales)
                .then(function (products) {
                  deferred.resolve(products);
                });
            })
        })
      return deferred.promise;
    }

    function getSalesCount(sales, userProducts) {
      var deferred = $q.defer();
      var soldProducts = [];
      var closedSales = _.filter(sales, ['status', 'CLOSED']);
      for (var i = 0; i < closedSales.length; i++) {
        closedSales[i].sale_date = new Date(closedSales[i].sale_date);
        for (var j = 0; j < closedSales[i].register_sale_products.length; j++) {
          var find = _.find(userProducts, ['id', closedSales[i].register_sale_products[j].product_id]);
          if (find) {
            soldProducts.push({ register_sale: closedSales[i].register_sale_products[j], product: find, sale: closedSales[i] });
          }
        }
      }
      deferred.resolve(soldProducts);
      return deferred.promise;
    }


  }

})();
