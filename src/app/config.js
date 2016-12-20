(function () {
  'use strict';

  angular
    .module('mbc')
    .config(firebaseConfig)

  function firebaseConfig() {
    var config = {
      apiKey: "AIzaSyCsCOAdNseQv_4pSTx_8j3Ek7yCfl6578o",
      authDomain: "test-1e6a6.firebaseapp.com",
      databaseURL: "https://test-1e6a6.firebaseio.com",
      storageBucket: "test-1e6a6.appspot.com",
      messagingSenderId: "915148570252"
    };
    firebase.initializeApp(config);
  }

})();
