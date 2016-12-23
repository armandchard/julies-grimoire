(function () {
  'use strict';

  angular.module('mbc.receipt')
    .controller('ReceiptController', receiptController);

  receiptController.$inject = ['$log', '$filter', 'receiptService', 'firebaseDataService', 'toastr'];

  function receiptController($log, $filter, receiptService, firebaseDataService, toastr) {
    var vm = this;
    vm.loading = false;

    vm.remove = remove;

    firebaseDataService.getReceipts()
      .$loaded(function (data) {
        vm.receipts = data;
      });

    function remove(receipt) {
      swal({
        title: 'Etes-vous sûr de vouloir supprimer cette recette ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#e8455e",
        confirmButtonText: 'Oui !',
        cancelButtonText: 'Annuler',
        closeOnConfirm: true
      },
        function () {
          vm.receipts.$remove(receipt)
            .then(function () {
              toastr.success('Recette supprimée');
            })
            .catch(function (error) {
              toastr.error(error.message);
            });
        });
    }
  }
})();
