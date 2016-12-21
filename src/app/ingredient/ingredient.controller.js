(function () {
  'use strict';

  angular.module('mbc.ingredient')
    .controller('IngredientController', ingredientController);

  ingredientController.$inject = ['$log', '$filter', '$uibModal', 'ingredientService', 'firebaseDataService', 'toastr'];

  function ingredientController($log, $filter, $uibModal, ingredientService, firebaseDataService, toastr) {
    var vm = this;
    vm.loading = false;
    vm.showForm = showForm;
    vm.deleteIngredient = deleteIngredient;

    firebaseDataService.getIngredients()
      .$loaded(function (data) {
        vm.ingredients = data;
      });

    function showForm(ingredient) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/ingredient/add-ingredient.html',
        controller: 'IngredientDetailController',
        controllerAs: 'vm',
        resolve: {
          ingredients: function () {
            return vm.ingredients;
          },
          ingredient: function () {
            return ingredient;
          }
        }
      });

      modalInstance.result.then(function () {
      }, function () {
      });
    }

    function deleteIngredient(ingredient) {
      swal({
        title: 'Etes-vous sûr de vouloir supprimer cet ingrédient ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#e8455e",
        confirmButtonText: 'Oui !',
        cancelButtonText: 'Annuler',
        closeOnConfirm: true
      },
        function () {
          vm.ingredients.$remove(ingredient)
            .then(function () {
              toastr.success('Ingrédient supprimé');
            })
            .catch(function (error) {
              toastr.error(error.message);
            });
        });
    }
  }
})();
