/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */

'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('soarFrameworkConfigurationWizard100Ctrl', soarFrameworkConfigurationWizard100Ctrl);

  soarFrameworkConfigurationWizard100Ctrl.$inject = ['$scope', 'widgetUtilityService', 'soarConfigService'];

  function soarFrameworkConfigurationWizard100Ctrl($scope, widgetUtilityService, soarConfigService) {
    $scope.defaultGlobalSettings = {};
    $scope.initList = [];
    $scope._buildPayload = _buildPayload;
    $scope.modifyGlobalSettings = modifyGlobalSettings;
    $scope.commitGlobalSettings = commitGlobalSettings;
    $scope.cancel = cancel;


    function _handleTranslations() {
      let widgetData = {
        name: $scope.config.name,
        version: $scope.config.version
      };
      let widgetNameVersion = widgetUtilityService.getWidgetNameVersion(widgetData);
      if (widgetNameVersion) {
        widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
            START_PAGE_TITLE: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_TITLE'),
            START_PAGE_DESCRIPTION: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_DESCRIPTION'),
            START_PAGE_IP_ADDRESS_LABEL: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_IP_ADDRESS_LABEL'),
            START_PAGE_IP_ADDRESS_TOOLTIP: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_IP_ADDRESS_TOOLTIP'),
            START_PAGE_IP_ADDRESS_PLACEHOLDER: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_IP_ADDRESS_PLACEHOLDER'),
            START_PAGE_URL_LABEL: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_URL_LABEL'),
            START_PAGE_URL_TOOLTIP: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_URL_TOOLTIP'),
            START_PAGE_URL_PLACEHOLDER: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_URL_PLACEHOLDER'),
            START_PAGE_DOMAIN_LABEL: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_DOMAIN_LABEL'),
            START_PAGE_DOMAIN_TOOLTIP: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_DOMAIN_TOOLTIP'),
            START_PAGE_DOMAIN_PLACEHOLDER: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_DOMAIN_PLACEHOLDER'),
            START_PAGE_PORTS_LABEL: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_PORTS_LABEL'),
            START_PAGE_PORTS_TOOLTIP: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_PORTS_TOOLTIP'),
            START_PAGE_PORTS_PLACEHOLDER: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_PORTS_PLACEHOLDER'),
            START_PAGE_FILES_LABEL: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_FILES_LABEL'),
            START_PAGE_FILES_TOOLTIP: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_FILES_TOOLTIP'),
            START_PAGE_FILES_PLACEHOLDER: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_FILES_PLACEHOLDER'),
            START_PAGE_CIDR_LABEL: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_CIDR_LABEL'),
            START_PAGE_CIDR_TOOLTIP: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_CIDR_TOOLTIP'),
            START_PAGE_CIDR_PLACEHOLDER: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_CIDR_PLACEHOLDER'),
            START_PAGE_SAVE_BUTTON: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_SAVE_BUTTON'),
            START_PAGE_CANCEL_BUTTON: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_CANCEL_BUTTON'),
          };
        });
      }
      else {
        $timeout(function () {
          $scope.cancel();
        }, 100)
      }
    }

    function _buildPayload(keyName, keyValue, action) {
      if (action === 'createKeyStore') {
        var apiPayload = soarConfigService.constants().createKeyStorePayload;
        apiPayload['key'] = keyName;
        apiPayload['notes'] = 'Enter the ' + (keyName.split('-')[2] === 'range' ? 'CIDR ranges' : keyName.split('-')[2]) + ' that you want to exclude from enrichment.';
        apiPayload['jSONValue'] = keyValue[0].length > 0 ? keyValue : '';
      }
      if (action === 'findKeyStore') {
        var apiPayload = soarConfigService.constants().findKeyStorePayload;
        apiPayload['filters'][0]['value'] = keyName;
      }
      return apiPayload;
    }


    function _handleGblVarsAndKeyStores() {
      soarConfigService.getGblVarToKeyStoreMapping().then(function (gblVarToKeyStoreMapping) {
        Object.keys(gblVarToKeyStoreMapping).forEach(function (item) {
          if (item === 'CIDR_Range') {
            var payload = _buildPayload('sfsp-cidr-range', null, 'findKeyStore');
            soarConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
              if (response && response['hydra:member'] && response['hydra:member'].length === 0) {
                var keyValue = gblVarToKeyStoreMapping['CIDR_Range'].defaultValue.split(',');
                var payload = _buildPayload('sfsp-cidr-range', keyValue, 'createKeyStore');
                soarConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                  $scope.defaultGlobalSettings[res.key] = { 'recordValue': res.jSONValue, 'recordUUID': res.uuid };
                });
              }
              else {
                $scope.defaultGlobalSettings[response['hydra:member'][0].key] = { 'recordValue': response['hydra:member'][0].jSONValue, 'recordUUID': response['hydra:member'][0].uuid };
              }
            });
          }
          else {
            soarConfigService.getGBLVariable(item).then(function (response) {
              // Check if exclude list global variable already present 
              if (response && response['hydra:member'] && response['hydra:member'].length > 0) {
                var gblVarName = response['hydra:member'][0].name;
                var gblVarID = response['hydra:member'][0].id;
                var keyName = gblVarToKeyStoreMapping[gblVarName].keystore;
                var keyValue = response['hydra:member'][0].value.split(',');
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
                  if (response && response['hydra:member'] && response['hydra:member'].length > 0) {
                    $scope.defaultGlobalSettings[response['hydra:member'][0].key] = { 'recordValue': response['hydra:member'][0].jSONValue, 'recordUUID': response['hydra:member'][0].uuid };
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
      });
    }


    function modifyGlobalSettings(updatedKeyStoreValue, keyStoreName) {
      $scope.defaultGlobalSettings[keyStoreName].recordValue = updatedKeyStoreValue;
    }


    function init() {
      // To set value to be displayed on "Global Settings" page
      _handleGblVarsAndKeyStores();
      // To handle backward compatibility for widget
      _handleTranslations();
    }

    init();

    function commitGlobalSettings() {
      Object.keys($scope.defaultGlobalSettings).forEach(function (item) {
        var keyValue = $scope.defaultGlobalSettings[item].recordValue;
        var uuid = $scope.defaultGlobalSettings[item].recordUUID;
        soarConfigService.updateKeyStoreRecord(keyValue, uuid);
      });
      $scope.close();
    }

    function cancel() {
      $scope.close();
    }

  }
})();
