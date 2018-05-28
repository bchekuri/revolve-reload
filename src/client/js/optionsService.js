(function () {
  'use strict';

  angular
    .module('options')
    .factory('OptionsService', OptionsService);

  OptionsService.$inject = [];

  function OptionsService() {

    var sv = {};

    sv.getDefaultOptions = function () {
      var defaultOptions = {};
      angular.copy(DEFAULT_OPTIONS, defaultOptions);
      return defaultOptions;
    };

    sv.getStoredOptions = function () {
      return new Promise(function (resolve, reject) {
        chrome.storage.sync.get(SYNC_STORAGE_NAME, function (storedOptions) {
          if (storedOptions) {
            resolve(storedOptions[SYNC_STORAGE_NAME]);
          } else {
            reject();
          }
        });
      });
    };

    sv.save = function (options) {
      var storeOptions = {};
      storeOptions[SYNC_STORAGE_NAME] = options;
      return new Promise(function (resolve, reject) {
        chrome.storage.sync.set(storeOptions, function () {
          resolve();
        });
      });

    };

    return sv;
  }

}());