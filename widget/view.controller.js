/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */

'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('soarFrameworkConfigurationWizard100Ctrl', soarFrameworkConfigurationWizard100Ctrl);

  soarFrameworkConfigurationWizard100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$rootScope', 'widgetBasePath', 'WizardHandler', 'soarConfigService', 'toaster'];

  function soarFrameworkConfigurationWizard100Ctrl($scope, widgetUtilityService, $rootScope, widgetBasePath, WizardHandler, soarConfigService, toaster) {
    $scope.keyStoreValue = {};
    $scope.defaultExcludedIpList = [];
    $scope.defaultExcludedDomainList = [];
    $scope.defaultExcludedUrlList = [];
    $scope.defaultExcludedPortList = [];
    $scope.defaultExcludedFileList = [];
    $scope.defaultExcludedCidrRangeList = [];
    $scope.emptyList = [];
    $scope.newKeyStoreValue = [];
    $scope.apiQueryPayload = {};
    $scope.moveNext = moveNext;
    $scope.moveBack = moveBack;
    $scope.isLightTheme = $rootScope.theme.id === 'light';
    $scope.startPageImage = $scope.isLightTheme ? widgetBasePath + 'images/sfsp-start-light.png' : widgetBasePath + 'images/sfsp-start-dark.png';
    $scope.test = test;
    $scope.testVal = testVal;

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

    function test(response){
      $scope.newKeyStoreValue = response;
      console.log($scope.newKeyStoreValue);
    }

    function testVal(){
      $scope.result = $scope.newKeyStoreValue;
      console.log($scope.result)
    }
    function init() {
      // To handle backward compatibility for widget
      $scope.apiQueryPayload = soarConfigService.constants();
      soarConfigService.getKeyStoreRecord($scope.apiQueryPayload.queryForKeyStore, 'keys').then(function (response) {
        if (response['hydra:member'].length > 0) {
          response['hydra:member'].forEach(function(item) {
            $scope.keyStoreValue[item.key] = item.jSONValue;
        });
          $scope.newKeyStoreValue = $scope.keyStoreValue;
          console.log($scope.newKeyStoreValue)
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
