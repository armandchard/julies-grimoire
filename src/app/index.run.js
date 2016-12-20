(function () {
  'use strict';

  angular
    .module('mbc')
    .run(runFunction)
    .run(angularMomentConfig)
    .run(amMoment)

  runFunction.$inject = ['$rootScope', '$state', 'firebaseDataService'];

  function runFunction($rootScope, $state, firebaseDataService) {
    $rootScope.$on('$routeChangeError', function (event, next, previous, error) {
      if (error === "AUTH_REQUIRED") {
        $state.go('login');
      }
    });
    $rootScope.$on('$stateChangeStart', function (e, to) {
      if (to.data && to.data.needAdmin) {
        firebaseDataService.getCurrentUser().$loaded(function (user) {
          var currentUser = user;
          if (!currentUser.admin) {
            $state.go('index.receipt');
          }
        });
      }
    });
  }

  function amMoment(amMoment) {
    amMoment.changeLocale('fr');
  }

  function angularMomentConfig(angularMomentConfig) {
    angularMomentConfig.preprocess = function (value) {
      return moment(value).locale(moment.locale());
    }
  }

})();
