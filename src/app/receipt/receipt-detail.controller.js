(function () {
  'use strict';

  angular.module('mbc.receipt')
    .controller('ReceiptDetailController', receiptDetailController);

  receiptDetailController.$inject = ['$q', '$stateParams', '$filter', 'firebaseDataService', 'toastr', '$firebaseObject', 'firebaseStorageService', '$uibModal'];

  function receiptDetailController($q, $stateParams, $filter, firebaseDataService, toastr, $firebaseObject, firebaseStorageService, $uibModal) {
    var vm = this;
    vm.loading = false;
    vm.spinOption = {
      min: 0,
      max: 100,
      step: 0.1,
      postfix: '%'
    };
    vm.spinOption2 = {
      min: 0,
      max: 10000,
      step: 1,
      postfix: 'g'
    };
    vm.sortableOptions = {
      connectWith: ".connectList",
      'ui-floating': true,
      stop: function () {
        for (var i = 0; i < vm.receipt.steps.length; i++) {
          vm.receipt.steps[i].position = i + 1;
        }
        vm.receipt.$save();
      }
    };
    vm.sortableFilesOptions = {
      connectWith: ".connectList",
      'ui-floating': true,
      stop: function () {
        for (var i = 0; i < vm.receipt.images.length; i++) {
          vm.receipt.images[i].position = i + 1;
        }
        vm.receipt.$save();
      }
    };

    if (angular.isDefined($stateParams.id)) {
      vm.id = $stateParams.id;
      var ref = firebase.database().ref().child('receipts/' + $stateParams.id);
      $firebaseObject(ref)
        .$loaded(function (data) {
          vm.receipt = data;
        })
    } else {
      vm.receipt = {};
    }

    vm.save = save;
    vm.changePercent = changePercent;
    vm.changeQuantity = changeQuantity;
    vm.showStepForm = showStepForm;
    vm.remove = remove;
    vm.removeFile = removeFile;

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

    function changePercent(ingredient) {
      if (angular.isDefined(vm.receipt.totalQuantity) && vm.receipt.totalQuantity > 0 && ingredient.percent !== '') {
        ingredient.gramme = ((parseFloat(ingredient.percent) / 100) * vm.receipt.totalQuantity).toFixed(2);
        ingredient.cost = angular.isDefined(ingredient.price) && angular.isDefined(ingredient.gramme) ? ((ingredient.price * ingredient.gramme) / ingredient.quantity).toFixed(2) : 0;
      } else {

      }
      vm.receipt.totalCompo = _.sumBy(vm.receipt.ingredients, function (i) {
        return i.percent !== '' ? parseFloat(i.percent) : 0;
      });
      vm.receipt.price = _.sumBy(vm.receipt.ingredients, function (i) {
        return angular.isDefined(i.cost) && i.cost !== '' ? parseFloat(i.cost) : 0;
      }).toFixed(2);
    }

    function changeQuantity() {
      for (var i = 0; i < vm.receipt.ingredients.length; i++) {
        changePercent(vm.receipt.ingredients[i]);
      }
    }

    function showStepForm(step) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/receipt/add-step.html',
        controller: 'StepDetailController',
        controllerAs: 'vm',
        resolve: {
          receipt: function () {
            return vm.receipt;
          },
          step: function () {
            return step;
          }
        }
      });

      modalInstance.result.then(function () {
      }, function () {
      });
    }

    function remove(index) {
      swal({
        title: 'Etes-vous sûr de vouloir supprimer cette étape ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#e8455e",
        confirmButtonText: 'Oui !',
        cancelButtonText: 'Annuler',
        closeOnConfirm: true
      },
        function () {
          vm.receipt.steps.splice(index, 1);
          toastr.success('Etape supprimée');
        });
    }

    function removeFile(index, name) {
      swal({
        title: 'Etes-vous sûr de vouloir supprimer l\'image?',
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#e8455e",
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: 'Annuler',
        closeOnConfirm: true
      },
        function () {
          firebaseStorageService.deleteFile(firebaseStorageService.storageProducts.child(vm.receipt.$id).child(name));
          vm.receipt.images.splice(index, 1);
          vm.receipt.$save();
          toastr.success('Image supprimée');
        });
    }

    function save() {
      var promises = [];
      if (angular.isDefined(vm.receipt.$id)) {
        vm.receipt.$save()
          .then(function () {
            toastr.success('Sauvegarde réussie');
          });
      } else {
        vm.receipts.$add(vm.receipt)
          .then(function (ref) {
            toastr.success('Sauvegarde réussie');
            vm.receipt = $firebaseObject(firebase.database().ref().child('receipts/' + ref.key));
          })
      }
      for (var i = 0; i < vm.assets.files.length; i++) {
        if (angular.isUndefined(vm.receipt.images)) {
          vm.receipt.images = [];
        }
        var imageExist = $filter('filter')(vm.receipt.images, function (p) {
          return p.name === vm.assets.files[i].file.name;
        })
        if (imageExist.length === 0) {
          promises.push(firebaseStorageService.upload(vm.assets.files[i].file, firebaseStorageService.storageProducts.child(vm.receipt.$id))
            .then(function (file) {
              vm.receipt.images.push(file);
            })
          );
        }
      }
      if (promises.length > 0) {
        $q.all(promises)
          .then(function () {
            vm.receipt.$save();
            toastr.success('Images uploadées');
            vm.assets.files = [];
          })
      }
    }
  }
})();
