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
    $scope.gblVarToKeyStoreMapping = {
      "Excludelist_IPs": {
        "keystore": "sfsp-excludelist-ips",
        "defaultValue": "8.8.8.8,10.1.1.2"
      },
      "Excludelist_URLs": {
        "keystore": "sfsp-excludelist-urls",
        "defaultValue": "https://www.google.com,https://mail.yahoo.com/login.html,https://www.office.com/"
      },
      "Excludelist_Domains": {
        "keystore": "sfsp-excludelist-domains",
        "defaultValue": "google.com,yahoo.com,fortinet.net,gmail.com,outlook.com,microsoft.com,fortinet.com,twitter.com,facebook.com,linkedin.com,instagram.com,fortiguard.com,forticloud.com,w3.org"
      },
      "Excludelist_Files": {
        "keystore": "sfsp-excludelist-files",
        "defaultValue": ""
      },
      "Excludelist_Ports": {
        "keystore": "sfsp-excludelist-ports",
        "defaultValue": ""
      },
      "CIDR_Range": {
        "keystore": "sfsp-cidr-range",
        "defaultValue": "10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
      }
    };
    $scope.moveNext = moveNext;
    $scope.moveBack = moveBack;
    $scope.getKeyStoreRecordValues = getKeyStoreRecordValues;
    $scope.isLightTheme = $rootScope.theme.id === 'light';
    $scope.startPageImage = $scope.isLightTheme ? widgetBasePath + 'images/sfsp-start-light.png' : widgetBasePath + 'images/sfsp-start-dark.png';
    $scope.test = test;
    $scope.buildPayload = buildPayload;

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
            $scope.keyStoreValue[item.key] = { 'recordValue': item.jSONValue, 'recordUUID': item.uuid };
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

    function buildPayload(keyStoreName, keyStoreValue) {
      var apiPayload = soarConfigService.constants().createKeyStorePayload;
      apiPayload['key'] = keyStoreName;
      apiPayload['jSONValue'] = keyStoreValue;
      return apiPayload;
    }


    function init() {
      var gblVarList = Object.keys($scope.gblVarToKeyStoreMapping);
      gblVarList.forEach(function (item) {
        soarConfigService.getGBLVariable(item).then(function (response) {
          if (response['hydra:member'].length > 0) {
            var gblVarName = response['hydra:member'][0].name;
            var keyStoreName = $scope.gblVarToKeyStoreMapping[gblVarName].keystore;
            var keyStoreValue = response['hydra:member'][0].value.split(',');
            var payload = buildPayload(keyStoreName, keyStoreValue);
            console.log(payload);
          }
          $scope.resp = response;
          console.log($scope.resp);
        });
      });
      // To handle backward compatibility for widget
      _handleTranslations();
    }

    init();
  }
})();
