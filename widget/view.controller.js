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
    $scope.initList = [];
    $scope.newKeyStoreValue = [];
    $scope.apiQueryPayload = {};
    $scope.moveNext = moveNext;
    $scope.moveBack = moveBack;
    $scope.getKeyStoreRecordValues = getKeyStoreRecordValues;
    $scope.isLightTheme = $rootScope.theme.id === 'light';
    $scope.startPageImage = $scope.isLightTheme ? widgetBasePath + 'images/sfsp-start-light.png' : widgetBasePath + 'images/sfsp-start-dark.png';
    $scope.test = test;

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          // Create your translating static string variables here
        };
      });
    }

    function getKeyStoreRecordValues() {
      $scope.apiQueryPayload = soarConfigService.constants();
      soarConfigService.getKeyStoreRecord($scope.apiQueryPayload.queryForKeyStore, 'keys').then(function (response) {
        if (response['hydra:member'].length > 0) {
          response['hydra:member'].forEach(function (item) {
            $scope.keyStoreValue[item.key] = {'recordValue': item.jSONValue, 'recordUUID': item.uuid};
          });
          console.log('placeholder');
        }
        else {
          toaster.error({ body: "Key Store record not found" });
        }
      })
    }

    function moveNext() {
      var currentStepTitle = WizardHandler.wizard('soarFrameworkConfigurationWizard').currentStep().wzTitle
      if (currentStepTitle === 'Start') {
        getKeyStoreRecordValues();
      }
      WizardHandler.wizard('soarFrameworkConfigurationWizard').next();
    }

    function moveBack() {
      WizardHandler.wizard('soarFrameworkConfigurationWizard').previous();
    }

    function test(newKeyStoreValue, keyStoreName) {
      var recordUUID = $scope.keyStoreValue[keyStoreName].recordUUID;
      soarConfigService.updateKeyStoreRecord(newKeyStoreValue, recordUUID)
      console.log($scope.keyStoreValue);
    }


    function init() {
      soarConfigService.executePlaybook().then(function () {
        return getKeyStoreRecordValues();
      });
      // To handle backward compatibility for widget
      _handleTranslations();
    }

    init();
  }
})();
