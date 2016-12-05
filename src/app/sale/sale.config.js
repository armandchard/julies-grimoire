(function () {
  'use strict';

  angular
    .module('mbc.sale')
    //.config(chartConfig);

  chartConfig.$inject = ['ChartJsProvider'];

  function chartConfig(ChartJsProvider) {
    ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
  }

})();
