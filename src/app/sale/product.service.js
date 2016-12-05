(function () {
  'use strict';

  angular
    .module('mbc.sale')
    .service('productService', productService);

  productService.$inject = ['$q', '$filter', '$http', 'CONSTS', 'firebaseDataService', 'firebaseStorageService'];

  function productService($q, $filter, $http, CONSTS, firebaseDataService, firebaseStorageService) {
    var userProducts = [];
    var service = {
      getList: getList,
      getProducts: getProducts,
      getProduct: getProduct,
      getProductAssets: getProductAssets,
      getFileUrl: getFileUrl,
      uploadVendImage: uploadVendImage,
      update: update,
      updateFull: updateFull,
      deleteProduct: deleteProduct,
      exportCsv: exportCsv,
      userProducts: userProducts,
      changeImagePosition: changeImagePosition,
      deleteVendImage: deleteVendImage
    };
    return service;

    function getList() {
      var productList = [];
      var deferred = $q.defer();
      $http.get(CONSTS.apiUrl + '/products?page=1')
        .then(function (data) {
          var promises = [];
          for (var i = 2; i <= data.data.pagination.pages; i++) {
            promises.push($http.get(CONSTS.apiUrl + '/products?page=' + i));
          }
          for (var j = 0; j < data.data.products.length; j++) {
            productList.push(data.data.products[j]);
          }
          $q.all(promises)
            .then(function (responses) {
              for (var j = 0; j < responses.length; j++) {
                var products = responses[j].data.products;
                for (var i = 0; i < products.length; i++) {
                  productList.push(products[i]);
                }
              }
              deferred.resolve(productList);
            })
        })
      return deferred.promise;
    }

    function getProducts() {
      return $http.get(CONSTS.apiUrl + '/products');
    }

    function getProduct(id) {
      return $http.get(CONSTS.apiUrl + '/products/' + id);
    }

    function update(product) {
      var convertProduct = {
        id: product.id,
        type: product.type,
        name: product.base_name,
        description: product.description,
        sku: product.sku,
        variant_option_one_name: product.variant_option_one_name,
        variant_option_one_value: product.variant_option_one_value,
        variant_option_two_name: product.variant_option_two_name,
        variant_option_two_value: product.variant_option_two_value,
        variant_option_three_name: product.variant_option_three_name,
        variant_option_three_value: product.variant_option_three_value,
        retail_price: product.retail_price,
        tax: product.tax_name,
        brand_name: product.brand_name,
        supplier_name: product.supplier_name
      };

      return $http.put(CONSTS.apiUrl + '/products', convertProduct);
    }

    function updateFull(product) {
      var convertProduct = {
        id: product.id,
        type: product.type,
        name: product.base_name,
        description: product.description,
        sku: product.sku,
        variant_option_one_name: product.variant_option_one_name,
        variant_option_one_value: product.variant_option_one_value,
        variant_option_two_name: product.variant_option_two_name,
        variant_option_two_value: product.variant_option_two_value,
        variant_option_three_name: product.variant_option_three_name,
        variant_option_three_value: product.variant_option_three_value,
        retail_price: product.retail_price,
        tax: product.tax_name,
        brand_name: product.brand_name,
        supplier_name: product.supplier_name,
        inventory: product.inventory
      };

      return $http.put(CONSTS.apiUrl + '/products', convertProduct);
    }

    function getFileUrl(id, filename) {
      return firebaseStorageService.storageProducts.child(id).child(filename).getDownloadURL();
    }

    function changeImagePosition(id, position) {
      return $http.put(CONSTS.apiUrl + '/product_images/' + id, { position: position });
    }

    function deleteVendImage(id) {
      return $http.delete(CONSTS.apiUrl + '/product_images/' + id);
    }

    function getProductAssets(id) {
      var deferred = $q.defer();
      var promises = [];
      firebaseDataService.getProductAssets(id)
        .$loaded(function (assets) {
          if (assets) {
            for (var i = 0; i < assets.length; i++) {
              promises.push(getFileUrl(id, assets[i].$value));
            }
          }
          $q.all(promises)
            .then(function (values) {
              deferred.resolve(values);
            })
            .catch(function () {
              deferred.resolve();
            })
        });
      return deferred.promise;
    }

    function deleteProduct(productId) {
      return $http.delete(CONSTS.apiUrl + '/products/' + productId);
    }

    function uploadVendImage(productId, file) {
      var deferred = $q.defer();
      $http.post(CONSTS.apiUrl + '/products/' + productId + '/actions/image_upload', { image: file })
        .then(function () {
          deferred.resolve();
        })
        .catch(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function exportCsv() {
      var deferred = $q.defer();
      // var exportList = [];
      $http.get(CONSTS.apiUrl + '/products/export')
        .then(function (data) {
          var promises = [];
          for (var i = 1; i <= data.data.pagination.pages; i++) {
            promises.push($http.get(CONSTS.apiUrl + '/products/export/' + i));
          }
          $q.all(promises)
            .then(function (responses) {
              var productsExport = '';
              for (var j = 0; j < responses.length; j++) {
                // var products = $filter('filter')(responses[j].data.products, function (p) {
                //   return p.active === true && p.deleted_at === null || p.deleted_at === '';
                // });
                var products = responses[j].data.products;
                for (var i = 0; i < products.length; i++) {
                  if (!products[i].sku.startsWith('vend-')) {
                    var price = products[i].price * (products[i].tax_rate + 1);
                    var name = products[i].name.replace(/"/g, '').replace(/^"?(.+?)"?$/, '$1');
                    if (name.length > 80) {
                      name = name.substring(0, 80);
                    }
                    var product = {
                      OP_CODE: 'ART01',
                      OP_ACTION: 'A',
                      CODE_SOC: 'MYPOPCORNER',
                      CODE_ARTICLE: products[i].sku,
                      REF_FOURNISSEUR: products[i].supplier_code !== null && products[i].supplier_code !== '' ? products[i].supplier_code : products[i].id.substring(products[i].id.length - 20, products[i].id.length),
                      LIBELLE_ARTICLE: products[i].name.replace(/"/g, '').replace(/^"?(.+?)"?$/, '$1'),
                      FAMILLE: products[i].type,
                      VALEUR: price.toFixed(2).toString().replace('.', ','),
                      ROTATION: 'A',
                      GESTION_LOT: '0',
                      GESTION_DATE: '0',
                      GESTION_NS: '0',
                      POIDS_UNITAIRE: '',
                      LONGUEUR_UNITAIRE: '',
                      LARGUEUR_UNITAIRE: '',
                      HAUTEUR_UNITAIRE: '',
                      EAN: products[i].sku,
                      SPBC: '',
                      COMPLEMENT1: products[i].variant_option_one_name.trim() !== '' ? products[i].variant_option_one_name.trim() + ' ' + products[i].variant_option_one_value.trim().replace(/"/g, '').replace(/^"?(.+?)"?$/, '$1') : null,
                      COMPLEMENT2: products[i].variant_option_two_name.trim() !== '' ? products[i].variant_option_two_name.trim() + ' ' + products[i].variant_option_two_value.trim().replace(/"/g, '').replace(/^"?(.+?)"?$/, '$1') : null,
                      COMPLEMENT3: products[i].variant_option_three_name.trim() !== '' ? products[i].variant_option_three_name.trim() + ' ' + products[i].variant_option_three_value.trim().replace(/"/g, '').replace(/^"?(.+?)"?$/, '$1') : null,
                      COMPLEMENT4: '',
                      COMPLEMENT5: ''
                    };
                    // exportList.push(product);
                    _.forEach(product, function (value) {
                      productsExport += value + ';'
                    })
                    productsExport += '\n';
                  }
                }
              }
              // var csv = Papa.unparse(exportList, { header: false, quotes: false, delimiter: ';' });
              deferred.resolve(productsExport);
            })
        })
      return deferred.promise;
    }

  }

})();
