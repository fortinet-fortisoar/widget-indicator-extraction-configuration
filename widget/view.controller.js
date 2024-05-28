/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */

'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('soarFrameworkConfigurationWizard100Ctrl', soarFrameworkConfigurationWizard100Ctrl);

  soarFrameworkConfigurationWizard100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$rootScope', 'widgetBasePath', 'WizardHandler', 'soarConfigService','toaster'];

  function soarFrameworkConfigurationWizard100Ctrl($scope, widgetUtilityService, $rootScope, widgetBasePath, WizardHandler, soarConfigService, toaster) {
    $scope.moveNext = moveNext;
    $scope.moveBack = moveBack;
    $scope.keyStoreValue = [];
    $scope.payload = {};
    $scope.defaultExcludeList = ['10.132.32.12', '12.32.122.4'];
    $scope.isLightTheme = $rootScope.theme.id === 'light';
    $scope.startPageImage = $scope.isLightTheme ? widgetBasePath + 'images/sfsp-start-light.png' : widgetBasePath + 'images/sfsp-start-dark.png';

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          // Create your translating static string variables here
        };
      });
    }

    function moveNext() {

      WizardHandler.wizard('soarFrameworkConfigurationWizard').next();
    }
    function moveBack() {

      WizardHandler.wizard('soarFrameworkConfigurationWizard').previous();
    }
    function init() {
      // To handle backward compatibility for widget
      $scope.payload = soarConfigService.constants();
      soarConfigService.getKeyStoreRecord($scope.payload.queryForKeyStore, 'keys').then(function (response) {
        if (response['hydra:member'] && (response['hydra:member'][0])) {
          $scope.entity = response;
          $scope.keyStoreValue = $scope.entity['hydra:member'][0].value.split(',');
          $scope.temp = 'test';
        }
        else {
          toaster.error({ body: "Key Store record not found, refer documentation" });
        }
      })

      _handleTranslations();
    }

    init();
  }
})();
