(function () {
  'use strict';

  angular.module('mbc.sale')
    .controller('SaleController', saleController);

  saleController.$inject = ['$log', '$filter', '$translate', 'saleService', 'DTOptionsBuilder'];

  function saleController($log, $filter, $translate, saleService, DTOptionsBuilder) {
    var vm = this;
    var today = new Date();
    var firstDayOfMonth = moment().startOf('month').toDate();
    var firstDayOfWeek = moment().startOf('week').toDate();
    vm.periodLabel = 'Mois en cours';
    // var firstDayOfWeek = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    vm.period = 'month';
    var salesData = [];
    var caData = [];
    vm.datePicker = { date: { startDate: firstDayOfMonth, endDate: today } };
    vm.loading = true;
    vm.ca = '0,00';
    vm.meanCart = '0,00';
    vm.quantity = 0;
    vm.totalClient = 0;
    vm.selectPeriod = selectPeriod;
    vm.options = {
      eventHandlers: {
        "apply.daterangepicker": function (ev, picker) {
          $translate('CURRENT_PERIOD')
            .then(function (currentPeriod) {
              vm.periodLabel = $filter('date')(new Date(vm.datePicker.date.startDate), 'dd/MM/yy') + currentPeriod + $filter('date')(new Date(vm.datePicker.date.endDate), 'dd/MM/yy');
            });
          getSales();
        }
      },
      locale: { format: 'DD/MM/YYYY' }
    }

    $translate('LEGEND_TURNOVER')
      .then(function (legendTurnover){
        vm.legendTurnover = legendTurnover;
      })
    $translate('LEGEND_SALES')
      .then(function (legendSales){
        vm.legendSales = legendSales;
      })
    saleService.loadProducts()
      .then(function () {
        getSales();
      });

    function initVars() {
      caData = [];
      vm.sales = [];
      salesData = [];
    }

    function getSales() {
      vm.loading = true;
      initVars();
      saleService.getSales(vm.datePicker.date)
        .then(function (data) {
          vm.sales = data;
          vm.totalClient = _.sumBy(vm.sales, function (sale) {
            return sale.register_sale.quantity > 0;
          });
          var ca = _.sumBy(vm.sales, 'register_sale.price_total');
          var caTTC = _.sumBy(vm.sales, function (sale) {
            return sale.register_sale.price_total + sale.register_sale.tax;
          });
          vm.ca = ca.toFixed(2);
          // vm.ca = ca.toFixed(2).toString().replace('.', ',');
          vm.quantity = _.sumBy(vm.sales, 'register_sale.quantity');
          if (vm.quantity > 0) {
            // vm.meanCart = (caTTC / vm.quantity).toFixed(2).toString().replace('.', ',');
            vm.meanCart = (caTTC / vm.quantity).toFixed(2);
          }
          getSalesByDay();
          getCaBySuppliers();
          vm.loading = false;
        });
    }

    function getCaBySuppliers(){
      vm.suppliersCA = [];
      var suppliersSales = _.groupBy(vm.sales, 'product.supplier_name');
      _.forIn(suppliersSales, function (value, key) {
        var quantity = _.sumBy(value, 'register_sale.quantity');
        var ca = _.sumBy(value, 'register_sale.price_total').toFixed(2);
        vm.suppliersCA.push({name: key, quantity: quantity, ca: parseFloat(ca)});
      })
      vm.suppliersCA = $filter('orderBy')(vm.suppliersCA, '-ca');
      // console.log(suppliersSales);
    }

    function getSalesByDay() {
      var sales = $filter('orderBy')(vm.sales, 'sale.sale_date');
      var dates = _.groupBy(sales, function (sale) {
        return $filter('date')(new Date(sale.sale.sale_date), 'dd/MM/yyyy');
      });

      _.forIn(dates, function (value) {
        var time = new Date(value[0].sale.sale_date).getTime();
        var quantity = _.sumBy(value, 'register_sale.quantity');
        var ca = _.sumBy(value, 'register_sale.price_total').toFixed(2);
        salesData.push([time, parseInt(quantity)]);
        caData.push([time, ca]);
      });

      vm.flotData = [{
        label: vm.legendTurnover,
        grow: { stepMode: "linear" },
        data: caData,
        color: "#e8455e",
        bars: {
          show: true,
          align: "center",
          barWidth: 24 * 60 * 60 * 600,
          lineWidth: 0,
          fillColor: {
            colors: [{ opacity: 0.6 }, { opacity: 0.6 }]
          }
        }
      },
      {
        label: vm.legendSales,
        grow: { stepMode: "linear" },
        data: salesData,
        yaxis: 2,
        color: "#273d6a",
        lines: {
          lineWidth: 1,
          show: true,
          fill: true,
          fillColor: {
            colors: [{ opacity: 0.5 }, { opacity: 0.5 }]
          }
        }
      }];

      vm.flotOptions = {
        grid: {
          hoverable: true,
          clickable: true,
          tickColor: "#676a6c",
          borderWidth: 0,
          color: '#676a6c'
        },
        colors: ["#1ab394", "#464f88"],
        tooltip: true,
        xaxis: {
          mode: "time",
          tickSize: [1, "day"],
          tickLength: 0,
          axisLabel: "Date",
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: 'Arial',
          axisLabelPadding: 10,
          color: "#d5d5d5"
        },
        yaxes: [
          {
            position: "left",
            color: "#d5d5d5",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Arial',
            axisLabelPadding: 3
          },
          {
            position: "right",
            color: "#d5d5d5",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: ' Arial',
            axisLabelPadding: 67
          }
        ],
        legend: {
          noColumns: 1,
          labelBoxBorderColor: "#d5d5d5",
          position: "nw"
        }
      };
    }

    function selectPeriod(period) {
      vm.period = period;
      switch (period) {
        case 'month':
          vm.datePicker.date = { startDate: firstDayOfMonth, endDate: today };
          $translate('CURRENT_MONTH')
            .then(function (currentMonth){
              vm.periodLabel = currentMonth;
            })
          break;
        case 'week':
          vm.datePicker.date = { startDate: firstDayOfWeek, endDate: today };
          $translate('CURRENT_WEEK')
            .then(function (currentWeek){
              vm.periodLabel = currentWeek;
            })
          break;
        case 'day':
          vm.datePicker.date = { startDate: today, endDate: today };
          $translate('CURRENT_DAY')
            .then(function (currentDay){
              vm.periodLabel = currentDay;
            })
          break;
      }
      getSales();
    }

    vm.dtOptions = DTOptionsBuilder.newOptions()
      .withBootstrap()
      .withOption('lengthMenu', [50, 100, 150, 200])
      .withOption('order', [3, 'desc'])
  }
})();
