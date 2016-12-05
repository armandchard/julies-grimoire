(function () {
  'use strict';

  angular
    .module('mbc')
    // .config(textAngularConfig)
    .config(firebaseConfig)

  function textAngularConfig($provide) {
    $provide.decorator('taOptions', taOptions);
    taOptions.$inject = ['taRegisterTool', '$delegate'];

    function taOptions(taRegisterTool, taOptions) {
      taOptions.toolbar = [
        ['h3', 'h4', 'h5', 'p'],
        ['bold', 'italics', 'ul', 'ol']
      ];
      return taOptions;
    }
  }

  function firebaseConfig() {
    // Initialize Firebase STAGING
    var config = {
      apiKey: "AIzaSyDstBtex2MVRU0yO99-jcRUjap9BgY8GD8",
      authDomain: "viewer-mbc.firebaseapp.com",
      databaseURL: "https://viewer-mbc.firebaseio.com",
      storageBucket: "viewer-mbc.appspot.com",
      messagingSenderId: "291696077916"
    };
    // Initialize Firebase PROD
    // var config = {
    //   apiKey: "AIzaSyCCSKeKJS0qEHhMUqG2lat3Vz6U7WiNDh8",
    //   authDomain: "front-mbc.firebaseapp.com",
    //   databaseURL: "https://front-mbc.firebaseio.com",
    //   storageBucket: "front-mbc.appspot.com",
    //   messagingSenderId: "620010175010"
    // };
    firebase.initializeApp(config);
  }

})();
