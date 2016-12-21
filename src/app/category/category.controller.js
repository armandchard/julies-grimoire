(function () {
  'use strict';

  angular.module('mbc.category')
    .controller('CategoryController', categoryController);

  categoryController.$inject = ['$log', '$filter', '$uibModal', 'categoryService', 'firebaseDataService', 'toastr'];

  function categoryController($log, $filter, $uibModal, categoryService, firebaseDataService, toastr) {
    var vm = this;
    vm.loading = false;
    vm.showForm = showForm;
    vm.deleteCategory = deleteCategory;

    firebaseDataService.getCategories()
      .$loaded(function (data) {
        vm.categories = data;
      });

    function showForm(category) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/category/add-category.html',
        controller: 'CategoryDetailController',
        controllerAs: 'vm',
        resolve: {
          categories: function () {
            return vm.categories;
          },
          category: function () {
            return category;
          }
        }
      });

      modalInstance.result.then(function () {
      }, function () {
      });
    }

    function deleteCategory(category) {
      swal({
        title: 'Etes-vous sûr de vouloir supprimer cette catégorie ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#e8455e",
        confirmButtonText: 'Oui !',
        cancelButtonText: 'Annuler',
        closeOnConfirm: true
      },
        function () {
          vm.categories.$remove(category)
            .then(function () {
              toastr.success('Catégorie supprimé');
            })
            .catch(function (error) {
              toastr.error(error.message);
            });
        });
    }
  }
})();
