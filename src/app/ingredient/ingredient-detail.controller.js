(function () {
  'use strict';

  angular.module('mbc.ingredient')
    .controller('IngredientDetailController', ingredientDetailController);

  ingredientDetailController.$inject = ['$uibModalInstance', 'ingredients', 'ingredient'];

  function ingredientDetailController($uibModalInstance, ingredients, ingredient) {
    var vm = this;
    vm.close = close;
    vm.ingredient = ingredient;

    function close(){
      if (angular.isDefined(vm.ingredient.$id) && vm.ingredient.$id !== null) {
        ingredients.$save(vm.ingredient);
      } else {
        ingredients.$add(vm.ingredient);
      }
      $uibModalInstance.dismiss('cancel');
    }
  }

})();
