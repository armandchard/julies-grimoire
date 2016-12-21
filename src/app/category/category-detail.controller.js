(function () {
  'use strict';

  angular.module('mbc.category')
    .controller('CategoryDetailController', categoryDetailController);

  categoryDetailController.$inject = ['$uibModalInstance', 'categories', 'category'];

  function categoryDetailController($uibModalInstance, categories, category) {
    var vm = this;
    vm.close = close;
    vm.category = category;

    function close(){
      if (angular.isDefined(vm.category.$id) && vm.category.$id !== null) {
        categories.$save(vm.category);
      } else {
        categories.$add(vm.category);
      }
      $uibModalInstance.dismiss('cancel');
    }
  }

})();
