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
    $scope.defaultGlobalSettings = {};
    $scope.initList = [];
    $scope.updatedGlobalSettings = {};
    $scope.moveNext = moveNext;
    $scope.moveBack = moveBack;
    $scope.isLightTheme = $rootScope.theme.id === 'light';
    $scope.startPageImage = $scope.isLightTheme ? widgetBasePath + 'images/sfsp-start-light.png' : widgetBasePath + 'images/sfsp-start-dark.png';
    $scope._buildPayload = _buildPayload;
    $scope.modifyGlobalSettings = modifyGlobalSettings;
    $scope.commitGlobalSettings = commitGlobalSettings;
    $scope.test = test;


    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          // Create your translating static string variables here
        };
      });
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
            var resp = response['hydra:member'];
            if (resp.length === 0) {
              var keyValue = $scope.gblVarToKeyStoreMapping['CIDR_Range'].defaultValue.split(',');
              var payload = _buildPayload('sfsp-cidr-range', keyValue, 'createKeyStore');
              soarConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                $scope.defaultGlobalSettings[res.key] = { 'recordValue': res.jSONValue, 'recordUUID': res.uuid };
              });
            }
            else {
              $scope.defaultGlobalSettings[resp[0].key] = { 'recordValue': resp[0].jSONValue, 'recordUUID': resp[0].uuid };
            }
          });
        }
        else {
          soarConfigService.getGBLVariable(item).then(function (response) {
            // Check if exclude list global variable already present 
            var resp = response['hydra:member'];
            if (resp.length > 0) {
              var gblVarName = resp[0].name;
              var gblVarID = resp[0].id;
              var keyName = $scope.gblVarToKeyStoreMapping[gblVarName].keystore;
              var keyValue = resp[0].value.split(',');
              var payload = _buildPayload(keyName, keyValue, 'createKeyStore');
              soarConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                $scope.defaultGlobalSettings[res.key] = { 'recordValue': res.jSONValue, 'recordUUID': res.uuid };
              });
              soarConfigService.deleteGBLVariable(gblVarID);
            }
            else {
              var keyName = $scope.gblVarToKeyStoreMapping[item].keystore;
              var payload = _buildPayload(keyName, null, 'findKeyStore');
              soarConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
                resp = response['hydra:member'];
                if (resp.length > 0) {
                  $scope.defaultGlobalSettings[resp[0].key] = { 'recordValue': resp[0].jSONValue, 'recordUUID': resp[0].uuid };
                }
                else {
                  var keyName = $scope.gblVarToKeyStoreMapping[item].keystore;
                  var keyValue = $scope.gblVarToKeyStoreMapping[item].defaultValue.split(',');
                  var payload = _buildPayload(keyName, keyValue, 'createKeyStore');
                  soarConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                    $scope.defaultGlobalSettings[res.key] = { 'recordValue': res.jSONValue, 'recordUUID': res.uuid };
                  });
                }
              });
            }
          });
        }
      });
    }


    function moveNext() {
      var currentStepTitle = WizardHandler.wizard('soarFrameworkConfigurationWizard').currentStep().wzTitle
      if (currentStepTitle === 'Start') {
        if (Object.keys($scope.updatedGlobalSettings).length === 0) {
          $scope.updatedGlobalSettings = angular.copy($scope.defaultGlobalSettings);
          console.log($scope.updatedGlobalSettings);
        }
      }
      if (currentStepTitle === 'Global Settings') {
        commitGlobalSettings();
      }
      WizardHandler.wizard('soarFrameworkConfigurationWizard').next();
    }


    function moveBack() {
      WizardHandler.wizard('soarFrameworkConfigurationWizard').previous();
    }


    function modifyGlobalSettings(updatedKeyStoreValue, keyStoreName) {
      $scope.updatedGlobalSettings[keyStoreName].recordValue = updatedKeyStoreValue;
      console.log($scope.updatedGlobalSettings);
    }


    function commitGlobalSettings() {
      Object.keys($scope.updatedGlobalSettings).forEach(function (item){
        var keyValue = $scope.updatedGlobalSettings[item].recordValue;
        var uuid = $scope.updatedGlobalSettings[item].recordUUID;
        soarConfigService.updateKeyStoreRecord(keyValue, uuid);
      });
    }


    function test(updatedKeyStoreValue, keyStoreName) {
      // var recordUUID = $scope.defaultGlobalSettings[keyStoreName].recordUUID;
      $scope.updatedGlobalSettings[keyStoreName].recordValue = updatedKeyStoreValue;
      // soarConfigService.updateKeyStoreRecord(updatedGlobalSettings, recordUUID)
      // console.log($scope.defaultGlobalSettings);
      console.log($scope.updatedGlobalSettings);
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
