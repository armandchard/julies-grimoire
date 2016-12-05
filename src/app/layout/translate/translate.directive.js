(function () {
  'use strict';

  angular
    .module('mbc.layout')
    .directive('translateMenu', translateMenu)
    .config(translate)
    .config(function (tmhDynamicLocaleProvider) {
      // tmhDynamicLocaleProvider.localeLocationPattern('app/angular/i18n/angular-locale_{{locale}}.js');
      tmhDynamicLocaleProvider.localeLocationPattern('../locales/angular-locale_{{locale}}.js');
    })

  function translateMenu() {
    return {
      templateUrl: 'app/layout/translate/translate.html',
      restrict: 'E',
      scope: {},
      controller: TranslateController,
      controllerAs: 'vm'
    };
  }

  TranslateController.$inject = ['$translate', 'tmhDynamicLocale'];

  function TranslateController($translate, tmhDynamicLocale) {
    var vm = this;
    tmhDynamicLocale.set('fr');
    vm.changeLanguage = function (langKey) {
      $translate.use(langKey);
      vm.language = langKey;
      tmhDynamicLocale.set(langKey);
    };
  }

  function translate($translateProvider) {
    $translateProvider
      .translations('fr', {
        LOGIN_LOGIN: 'Connexion',
        LOGIN_PASSWORD: 'Mot de passe',
        NAVBAR_LOGIN: 'Connexion',
        NAVBAR_LOGOUT: 'Déconnexion',
        TRANSLATE_LANGUAGE: 'Langue',
        TRANSLATE_FRENCH: 'Français',
        TRANSLATE_ENGLISH: 'Anglais',
        SELECT_INTERVAL: 'Sélectionner un intervalle de date :',
        SELECT_PERIOD: 'ou une période en cours',
        MONTH: 'Mois',
        WEEK: 'Semaine',
        DAY: 'Jour',
        CURRENT_MONTH: 'Mois en cours',
        CURRENT_WEEK: 'Semaine en cours',
        CURRENT_DAY: 'Aujourd\'hui',
        CURRENT_PERIOD: ' au ',
        TURNOVER: 'Chiffre d\'affaire',
        TURNOVER_HT: 'Chiffre d\'affaire HT',
        SALES: 'Ventes',
        TOTAL_SALES: 'Total des ventes',
        BASKET_VALUE: 'Panier moyen',
        BASKET_VALUE_TTC: 'Panier moyen TTC',
        CUSTOMERS: 'Clients',
        TOTAL_CUSTOMERS: 'Total de clients',
        LEGEND_TURNOVER: 'Chiffre d\'affaire',
        LEGEND_SALES: 'Ventes',
        LEGEND_TOTAL_SALES: 'Total des ventes HT sur la période',
        LEGEND_BASKET: 'Panier moyen TTC sur la période',
        LEGEND_TOTAL_TURNOVER: 'Total chiffre d\'affaires HT sur la période',
        TITLE_SALES_BY_SUPPLIERS: 'Ventes par marques',
        HEADER_BRAND: 'Marques',
        HEADER_TURNOVER: 'CA HT',
        HEADER_TOTAL_SALES: 'Nombre de ventes'
      })
      .translations('en', {
        LOGIN_LOGIN: 'Log in',
        LOGIN_PASSWORD: 'Password',
        NAVBAR_LOGIN: 'Log in',
        NAVBAR_LOGOUT: 'Log out',
        TRANSLATE_LANGUAGE: 'Language',
        TRANSLATE_FRENCH: 'French',
        TRANSLATE_ENGLISH: 'English',
        SELECT_INTERVAL: 'Select date range :',
        SELECT_PERIOD: 'or current period',
        MONTH: 'Mois',
        WEEK: 'Week',
        DAY: 'Day',
        CURRENT_MONTH: 'Current month',
        CURRENT_WEEK: 'Current week',
        CURRENT_DAY: 'Today',
        CURRENT_PERIOD: ' To ',
        TURNOVER: 'Turnover',
        TURNOVER_HT: 'Turnover excluding tax',
        SALES: 'Sales',
        TOTAL_SALES: 'Total sales',
        BASKET_VALUE: 'Basket value',
        BASKET_VALUE_TTC: 'Basket value including tax',
        CUSTOMERS: 'Customers',
        TOTAL_CUSTOMERS: 'Total customers',
        LEGEND_TURNOVER: 'Turnover',
        LEGEND_SALES: 'Sales',
        LEGEND_TOTAL_SALES: 'Total sales excluding tax on period',
        LEGEND_BASKET: 'Basket value on period',
        LEGEND_TOTAL_TURNOVER: 'Total turnover excluding tax on period',
        TITLE_SALES_BY_SUPPLIERS: 'Sales by supplier',
        HEADER_BRAND: 'Suppliers',
        HEADER_TURNOVER: 'Turnover',
        HEADER_TOTAL_SALES: 'Total sales'
      });
    $translateProvider.preferredLanguage('fr');
  }

})();
