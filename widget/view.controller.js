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
    $scope.defaultGlobalSettings = {}; // Holds values to be displayed in "Global Settings" page
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
    $scope._buildPayload = _buildPayload;

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
            $scope.defaultGlobalSettings[item.key] = { 'recordValue': item.jSONValue, 'recordUUID': item.uuid };
          });
          console.log('placeholder');
        }
        else {
          toaster.error({ body: "Key Store record not found" });
        }
      })
    }

    function moveNext() {
      // var currentStepTitle = WizardHandler.wizard('soarFrameworkConfigurationWizard').currentStep().wzTitle
      // if (currentStepTitle === 'Start') {
      //   getKeyStoreRecordValues();
      // }
      WizardHandler.wizard('soarFrameworkConfigurationWizard').next();
    }

    function moveBack() {
      WizardHandler.wizard('soarFrameworkConfigurationWizard').previous();
    }

    function test(newKeyStoreValue, keyStoreName) {
      var recordUUID = $scope.defaultGlobalSettings[keyStoreName].recordUUID;
      soarConfigService.updateKeyStoreRecord(newKeyStoreValue, recordUUID)
      console.log($scope.defaultGlobalSettings);
    }

    function _buildPayload(keyName, keyValue, action) {
      if (action === 'createKeyStore') {
        var apiPayload = soarConfigService.constants().createKeyStorePayload;
        apiPayload['key'] = keyName;
        apiPayload['jSONValue'] = keyValue[0].length > 0 ? keyValue : '';
      }
      if (action === 'findKeyStore') {
        var apiPayload = soarConfigService.constants().findKeyStorePayload;
        apiPayload['filters'][0]['value'] = keyName;
      }
      return apiPayload;
    }

    function _handleGblVarsAndKeyStores() {
      Object.keys($scope.gblVarToKeyStoreMapping).forEach(function (item) {
        if (item === 'CIDR_Range') {
          var payload = _buildPayload('sfsp-cidr-range', null, 'findKeyStore');
          soarConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
            if (response['hydra:member'].length === 0) {
              var keyValue = $scope.gblVarToKeyStoreMapping['CIDR_Range'].defaultValue.split(',');
              var payload = _buildPayload('sfsp-cidr-range', keyValue, 'createKeyStore');
              soarConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                $scope.defaultGlobalSettings[res.key] = { 'recordValue': res.jSONValue, 'recordUUID': res.uuid };
                console.log(res);
              });
              console.log(payload);
            }
            else {
              $scope.defaultGlobalSettings[response['hydra:member'][0].key] = { 'recordValue': response['hydra:member'][0].jSONValue, 'recordUUID': response['hydra:member'][0].uuid };
              console.log(response);
            }
          });
        }
        else {
          soarConfigService.getGBLVariable(item).then(function (response) {
            // Check if exclude list global variable already present 
            if (response['hydra:member'].length > 0) {
              var gblVarName = response['hydra:member'][0].name;
              var gblVarID = response['hydra:member'][0].id;
              var keyName = $scope.gblVarToKeyStoreMapping[gblVarName].keystore;
              var keyValue = response['hydra:member'][0].value.split(',');
              var payload = _buildPayload(keyName, keyValue, 'createKeyStore');
              soarConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                $scope.defaultGlobalSettings[res.key] = { 'recordValue': res.jSONValue, 'recordUUID': res.uuid };
                console.log(res);
              });
              soarConfigService.deleteGBLVariable(gblVarID);
              console.log(payload);
            }
            else {
              var keyName = $scope.gblVarToKeyStoreMapping[item].keystore;
              var payload = _buildPayload(keyName, null, 'findKeyStore');
              soarConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
                if (response['hydra:member'].length > 0) {
                  $scope.defaultGlobalSettings[response['hydra:member'][0].key] = { 'recordValue': response['hydra:member'][0].jSONValue, 'recordUUID': response['hydra:member'][0].uuid };
                  console.log(response);

                }
                else {
                  var keyName = $scope.gblVarToKeyStoreMapping[item].keystore;
                  var keyValue = $scope.gblVarToKeyStoreMapping[item].defaultValue.split(',');
                  var payload = _buildPayload(keyName, keyValue, 'createKeyStore');
                  soarConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                    $scope.defaultGlobalSettings[res.key] = { 'recordValue': res.jSONValue, 'recordUUID': res.uuid };
                    console.log(res);
                  });
                }
              });
            }
          });
        }
      });
    }

    function init() {
      // To set value to be displayed on "Global Settings" page
      _handleGblVarsAndKeyStores();
      // To handle backward compatibility for widget
      _handleTranslations();
    }

    init();
  }
})();
