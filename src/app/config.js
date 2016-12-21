(function () {
  'use strict';

  angular
    .module('mbc')
    .config(firebaseConfig)

  function firebaseConfig() {
    var config = {
      apiKey: "AIzaSyCmL8hsfv4DY-4QMR638tL--lyWnXNok-Y",
      authDomain: "julies-grimoire.firebaseapp.com",
      databaseURL: "https://julies-grimoire.firebaseio.com",
      storageBucket: "julies-grimoire.appspot.com",
      messagingSenderId: "309428091870"
    };
    firebase.initializeApp(config);
  }

})();
