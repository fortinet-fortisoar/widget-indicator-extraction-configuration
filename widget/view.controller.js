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
    var gblVarToKeyStoreMapping = soarConfigService.constants().gblVarToKeyStoreMapping;
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
      Object.keys(gblVarToKeyStoreMapping).forEach(function (item) {
        if (item === 'CIDR_Range') {
          var payload = _buildPayload('sfsp-cidr-range', null, 'findKeyStore');
          soarConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
            var resp = response['hydra:member'];
            if (resp && resp.length === 0) {
              var keyValue = gblVarToKeyStoreMapping['CIDR_Range'].defaultValue.split(',');
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
            if (resp && resp.length > 0) {
              var gblVarName = resp[0].name;
              var gblVarID = resp[0].id;
              var keyName = gblVarToKeyStoreMapping[gblVarName].keystore;
              var keyValue = resp[0].value.split(',');
              var payload = _buildPayload(keyName, keyValue, 'createKeyStore');
              soarConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                $scope.defaultGlobalSettings[res.key] = { 'recordValue': res.jSONValue, 'recordUUID': res.uuid };
              });
              soarConfigService.deleteGBLVariable(gblVarID);
            }
            else {
              var keyName = gblVarToKeyStoreMapping[item].keystore;
              var payload = _buildPayload(keyName, null, 'findKeyStore');
              soarConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
                resp = response['hydra:member'];
                if (resp && resp.length > 0) {
                  $scope.defaultGlobalSettings[resp[0].key] = { 'recordValue': resp[0].jSONValue, 'recordUUID': resp[0].uuid };
                }
                else {
                  var keyName = gblVarToKeyStoreMapping[item].keystore;
                  var keyValue = gblVarToKeyStoreMapping[item].defaultValue.split(',');
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
    }


    function commitGlobalSettings() {
      Object.keys($scope.updatedGlobalSettings).forEach(function (item){
        var keyValue = $scope.updatedGlobalSettings[item].recordValue;
        var uuid = $scope.updatedGlobalSettings[item].recordUUID;
        soarConfigService.updateKeyStoreRecord(keyValue, uuid);
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
