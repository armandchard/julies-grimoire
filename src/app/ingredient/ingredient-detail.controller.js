(function () {
  'use strict';

  angular.module('mbc.ingredient')
    .controller('IngredientDetailController', ingredientDetailController);

  ingredientDetailController.$inject = ['$uibModalInstance', 'ingredients', 'ingredient'];

  function ingredientDetailController($uibModalInstance, ingredients, ingredient) {
    var vm = this;
    vm.close = close;
    vm.ingredient = ingredient;

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
      if (angular.isDefined(vm.ingredient.$id) && vm.ingredient.$id !== null) {
        ingredients.$save(vm.ingredient);
      } else {
        ingredients.$add(vm.ingredient);
      }
      $uibModalInstance.dismiss('cancel');
    }
  }

})();
