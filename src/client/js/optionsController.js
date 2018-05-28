/**
* BChekuri
*/


(function () {
  'use strict';

  angular
    .module('options')
    .controller('OptionsController', OptionsController);

  OptionsController.$inject = ['$scope', 'OptionsService'];

  function OptionsController($scope, OptionsService) {
    var vm = this;
	vm.title = APP_NAME;
	vm.options = OptionsService.getDefaultOptions();

	OptionsService.getStoredOptions().then(function(storedOptions){
		if(storedOptions) {
			vm.options = storedOptions;
		}
	}).catch(function(err) {
		console.log(err);
	});

	vm.reset = function() {
		vm.options = OptionsService.getDefaultOptions();
		resetSave(vm.options);
		$('#resetModal').modal('hide');
	};

	vm.resetWarning = function() {
		$('#resetModal').modal('show');
	};

	vm.onChange = function(item, messagePlace) {
		save(item, vm.options, (messagePlace ? messagePlace : "right" ));
	};

	function resetSave(options) {
		OptionsService.save(options).then(function(){
		}).catch(function(err) {
		});
	}

	function save(item, options, messagePlace) {
		OptionsService.save(options).then(function(){
			SmartFeedback.show(item, "info", "Save", messagePlace);
		}).catch(function(err) {
			SmartFeedback.show(item, "error", "Failed", messagePlace);
		});
	};

  }
}());





