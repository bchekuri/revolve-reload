(function (window) {
  'use strict';

  var applicationModuleName = 'revolveReload';

  var applicationModuleVendorDependencies = [];

  angular
    .module(applicationModuleName, applicationModuleVendorDependencies);

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    configModule: function(moduleName, dependencies) {
        angular.module(moduleName, dependencies || []);
        angular.module(applicationModuleName).requires.push(moduleName);
    }
  };

  window.ApplicationConfiguration = service;

}(window));