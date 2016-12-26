(function () {
  'use strict';

  angular.module('mbc.receipt')
    .controller('ReceiptController', receiptController);

  receiptController.$inject = ['$log', '$filter', 'firebaseDataService', 'toastr'];

  function receiptController($log, $filter, firebaseDataService, toastr) {
    var vm = this;
    vm.loading = false;

    vm.remove = remove;
    vm.duplicate = duplicate;

    firebaseDataService.getReceipts()
      .$loaded(function (data) {
        vm.receipts = data;
      });

    function duplicate(receipt) {
      var copy = angular.copy(receipt);
      copy.name += " Copie";
      var newReceipt = {
        name: copy.name,
        price: copy.price,
        categories: copy.categories,
        ingredients: copy.ingredients,
        steps: copy.steps,
        totalCompo: copy.totalCompo,
        totalQuantity: copy.totalQuantity,
        images: copy.images
      }
      vm.receipts.$add(newReceipt);
    }

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
