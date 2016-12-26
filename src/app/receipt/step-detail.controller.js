(function () {
  'use strict';

  angular.module('mbc.ingredient')
    .controller('StepDetailController', stepDetailController);

  stepDetailController.$inject = ['$uibModalInstance', 'receipt', 'step'];

  function stepDetailController($uibModalInstance, receipt, step) {
    var vm = this;
    vm.close = close;
    vm.step = step;

    function close() {
      if (angular.isUndefined(receipt.steps)) {
        receipt.steps = [];
      }
      if (angular.isUndefined(vm.step.$$hashKey)) {
        receipt.steps.push(vm.step);
      }
      receipt.$save();
      $uibModalInstance.dismiss('cancel');
    }
  }

})();
