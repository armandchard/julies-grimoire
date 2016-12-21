(function () {
  'use strict';

  angular.module('mbc.receipt')
    .controller('ReceiptController', receiptController);

  receiptController.$inject = ['$log', '$filter', 'receiptService'];

  function receiptController($log, $filter, receiptService) {
    var vm = this;
    vm.loading = false;
  }
})();
