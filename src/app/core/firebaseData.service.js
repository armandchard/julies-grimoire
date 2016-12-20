(function () {
  'use strict';

  angular
    .module('mbc.core')
    .factory('firebaseDataService', firebaseDataService);

  firebaseDataService.$inject = ['$firebaseObject', '$firebaseArray', 'Auth'];

  function firebaseDataService($firebaseObject, $firebaseArray, Auth) {
    var root = firebase.database().ref();
    var currentUser = null;
    var service = {
      root: root,
      getReceipts: getReceipts,
      getIngredients: getIngredients,
      getCategories: getCategories,
      getUser: getUser,
      getAccount: getAccount,
      getCurrentUser: getCurrentUser,
      currentUser: currentUser
    };
    return service;

    function getReceipts() {
      return $firebaseArray(service.root.child('receipts'));
    }
    function getIngredients() {
      return $firebaseArray(service.root.child('ingredients'));
    }
    function getCategories() {
      return $firebaseArray(service.root.child('categories'));
    }

    function getUser(uid) {
      return $firebaseObject(service.root.child('users/' + uid));
    }

    function getAccount() {
      return $firebaseObject(service.root.child('account'));
    }

    function getCurrentUser() {
      if (angular.isUndefined(service.currentUser) || service.currentUser === null) {
        var user = Auth.$getAuth();
        service.currentUser = getUser(user.uid);
        return service.currentUser;
      } else {
        return service.currentUser;
      }
    }

  }

})();
