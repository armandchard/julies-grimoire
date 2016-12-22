(function () {
  'use strict';

  angular.module('mbc.receipt')
    .controller('ReceiptController', receiptController);

  receiptController.$inject = ['$log', '$filter', 'receiptService', 'firebaseDataService', 'toastr'];

  function receiptController($log, $filter, receiptService, firebaseDataService, toastr) {
    var vm = this;
    vm.loading = false;

    firebaseDataService.getReceipts()
      .$loaded(function (data) {
        vm.receipts = data;
      });
  }
})();
