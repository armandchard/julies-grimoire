(function () {
  'use strict';

  angular.module('mbc.receipt')
    .controller('ReceiptDetailController', receiptDetailController);

  receiptDetailController.$inject = ['$stateParams', '$filter', 'receiptService', 'firebaseDataService', 'toastr', '$firebaseObject'];

  function receiptDetailController($stateParams, $filter, receiptService, firebaseDataService, toastr, $firebaseObject) {
    var vm = this;
    vm.loading = false;
    if (angular.isDefined($stateParams.id)) {
      var ref = firebase.database().ref().child('receipts/' + $stateParams.id);
      $firebaseObject(ref)
        .$loaded(function (data) {
        vm.receipt = data;
      })
    } else {
      vm.receipt = {};
    }

    vm.save = save;

    firebaseDataService.getReceipts()
      .$loaded(function (data) {
        vm.receipts = data;
      });
    firebaseDataService.getIngredients()
      .$loaded(function (data) {
        vm.ingredients = data;
      });
    firebaseDataService.getCategories()
      .$loaded(function (data) {
        vm.categories = data;
      });

    function save() {
      if (angular.isDefined(vm.receipt.$id)) {
        vm.receipt.$save();
      } else {
        vm.receipts.$add(vm.receipt)
          .then(function (ref) {
            vm.receipt = $firebaseObject(firebase.database().ref().child('receipts/' + ref.key));
          })
      }
    }
  }
})();
