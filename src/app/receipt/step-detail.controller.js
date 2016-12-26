(function () {
  'use strict';

  angular.module('mbc.ingredient')
    .controller('StepDetailController', stepDetailController);

  stepDetailController.$inject = ['$uibModalInstance', 'receipt', 'step'];

  function stepDetailController($uibModalInstance, receipt, step) {
    var vm = this;
    vm.close = close;
    vm.step = step;
    vm.noteOptions = {
      height: 300,
      focus: false,
      airMode: false,
      toolbar: [
        ['edit', ['undo', 'redo']],
        ['headline', ['style']],
        ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
        ['fontface', ['fontname']],
        ['textsize', ['fontsize']],
        ['fontclr', ['color']],
        ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
        ['height', ['height']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video', 'hr']],
        ['view', ['fullscreen']]
      ]
    };


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
