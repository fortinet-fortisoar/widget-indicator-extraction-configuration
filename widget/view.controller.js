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
      let widgetData = {
        name: $scope.config.name,
        version: $scope.config.version
      };
      let widgetNameVersion = widgetUtilityService.getWidgetNameVersion(widgetData);
      if (widgetNameVersion) {
        widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
            START_PAGE_WZ_TITLE: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_WZ_TITLE'),
            LABEL_TITLE: widgetUtilityService.translate('soarFrameworkConfigurationWizard.LABEL_TITLE'),
            START_PAGE_TITLE: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_TITLE'),
            START_PAGE_DESCRIPTION: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_DESCRIPTION'),
            START_PAGE_BUTTON: widgetUtilityService.translate('soarFrameworkConfigurationWizard.START_PAGE_BUTTON'),


            SECOND_PAGE_WZ_TITLE: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_WZ_TITLE'),
            SECOND_PAGE_TITLE: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_TITLE'),
            SECOND_PAGE_DESCRIPTION: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_DESCRIPTION'),
            SECOND_PAGE_IP_ADDRESS_LABEL: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_IP_ADDRESS_LABEL'),
            SECOND_PAGE_IP_ADDRESS_TOOLTIP: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_IP_ADDRESS_TOOLTIP'),
            SECOND_PAGE_IP_ADDRESS_PLACEHOLDER: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_IP_ADDRESS_PLACEHOLDER'),
            SECOND_PAGE_URL_LABEL: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_URL_LABEL'),
            SECOND_PAGE_URL_TOOLTIP: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_URL_TOOLTIP'),
            SECOND_PAGE_URL_PLACEHOLDER: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_URL_PLACEHOLDER'),
            SECOND_PAGE_DOMAIN_LABEL: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_DOMAIN_LABEL'),
            SECOND_PAGE_DOMAIN_TOOLTIP: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_DOMAIN_TOOLTIP'),
            SECOND_PAGE_DOMAIN_PLACEHOLDER: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_DOMAIN_PLACEHOLDER'),
            SECOND_PAGE_PORTS_LABEL: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_PORTS_LABEL'),
            SECOND_PAGE_PORTS_TOOLTIP: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_PORTS_TOOLTIP'),
            SECOND_PAGE_PORTS_PLACEHOLDER: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_PORTS_PLACEHOLDER'),
            SECOND_PAGE_FILES_LABEL: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_FILES_LABEL'),
            SECOND_PAGE_FILES_TOOLTIP: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_FILES_TOOLTIP'),
            SECOND_PAGE_FILES_PLACEHOLDER: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_FILES_PLACEHOLDER'),
            SECOND_PAGE_CIDR_LABEL: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_CIDR_LABEL'),
            SECOND_PAGE_CIDR_TOOLTIP: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_CIDR_TOOLTIP'),
            SECOND_PAGE_CIDR_PLACEHOLDER: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_CIDR_PLACEHOLDER'),
            SECOND_PAGE_BACK_BUTTON: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_BACK_BUTTON'),
            SECOND_PAGE_NEXT_BUTTON: widgetUtilityService.translate('soarFrameworkConfigurationWizard.SECOND_PAGE_NEXT_BUTTON'),
          };
        });
      }
      else {
        $timeout(function () {
          cancel();
        }, 100)
      }
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
      Object.keys($scope.updatedGlobalSettings).forEach(function (item) {
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
