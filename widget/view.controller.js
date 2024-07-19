/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */

'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('configureIndicatorExtraction100Ctrl', configureIndicatorExtraction100Ctrl);

  configureIndicatorExtraction100Ctrl.$inject = ['$scope', 'widgetUtilityService', 'soarConfigService', 'widgetBasePath'];

  function configureIndicatorExtraction100Ctrl($scope, widgetUtilityService, soarConfigService, widgetBasePath) {
    $scope.defaultGlobalSettings = {};
    $scope.initList = [];
    $scope._buildPayload = _buildPayload;
    $scope.modifyGlobalSettings = modifyGlobalSettings;
    $scope.commitGlobalSettings = commitGlobalSettings;
    $scope.cancel = cancel;
    $scope.errorFound = { 'index': 0, 'status': false };
    $scope.validateIOC = validateIOC;
    var regexPatternMapping = {};


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
            START_PAGE_TITLE: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_TITLE'),
            START_PAGE_DESCRIPTION: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_DESCRIPTION'),
            START_PAGE_IP_ADDRESS_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_IP_ADDRESS_LABEL'),
            START_PAGE_IP_ADDRESS_TOOLTIP: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_IP_ADDRESS_TOOLTIP'),
            START_PAGE_IP_ADDRESS_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_IP_ADDRESS_PLACEHOLDER'),
            START_PAGE_IP_ADDRESS_ERROR_MESSAGE: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_IP_ADDRESS_ERROR_MESSAGE'),
            START_PAGE_URL_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_URL_LABEL'),
            START_PAGE_URL_TOOLTIP: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_URL_TOOLTIP'),
            START_PAGE_URL_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_URL_PLACEHOLDER'),
            START_PAGE_URL_ERROR_MESSAGE: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_URL_ERROR_MESSAGE'),
            START_PAGE_DOMAIN_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_DOMAIN_LABEL'),
            START_PAGE_DOMAIN_TOOLTIP: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_DOMAIN_TOOLTIP'),
            START_PAGE_DOMAIN_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_DOMAIN_PLACEHOLDER'),
            START_PAGE_DOMAIN_ERROR_MESSAGE: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_DOMAIN_ERROR_MESSAGE'),
            START_PAGE_PORTS_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_PORTS_LABEL'),
            START_PAGE_PORTS_TOOLTIP: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_PORTS_TOOLTIP'),
            START_PAGE_PORTS_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_PORTS_PLACEHOLDER'),
            START_PAGE_PORTS_ERROR_MESSAGE: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_PORTS_ERROR_MESSAGE'),
            START_PAGE_FILES_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_FILES_LABEL'),
            START_PAGE_FILES_TOOLTIP: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_FILES_TOOLTIP'),
            START_PAGE_FILES_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_FILES_PLACEHOLDER'),
            START_PAGE_CIDR_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_CIDR_LABEL'),
            START_PAGE_CIDR_TOOLTIP: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_CIDR_TOOLTIP'),
            START_PAGE_CIDR_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_CIDR_PLACEHOLDER'),
            START_PAGE_CIDR_ERROR_MESSAGE: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_CIDR_ERROR_MESSAGE'),
            START_PAGE_SAVE_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_SAVE_BUTTON'),
            START_PAGE_CANCEL_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_CANCEL_BUTTON')
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
      soarConfigService.getGblVarToKeyStoreMapping(widgetBasePath).then(function (gblVarToKeyStoreMapping) {
        Object.keys(gblVarToKeyStoreMapping).forEach(function (item) {
          if (item === 'CIDR_Range') {
            var payload = _buildPayload('sfsp-excludelist-cidr-ranges', null, 'findKeyStore');
            soarConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
              if (response && response['hydra:member'] && response['hydra:member'].length === 0) {
                // Check if the keystore record exists for CIDR range; create it if not found
                var keyValue = gblVarToKeyStoreMapping['CIDR_Range'].defaultValue.split(',');
                var payload = _buildPayload('sfsp-excludelist-cidr-ranges', keyValue, 'createKeyStore');
                soarConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                  // Create keystore record
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
                var keyValue = [...new Set(response['hydra:member'][0].value.split(','))];
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
          regexPatternMapping[gblVarToKeyStoreMapping[item].keystore] = { 'index': gblVarToKeyStoreMapping[item].index, "pattern": gblVarToKeyStoreMapping[item].pattern };
        });
      });
    }


    function validateIOC(updatedKeyStoreValue, keyStoreName) {
      var regexPattern = regexPatternMapping[keyStoreName];
      var invalidIOCs = []

      if (keyStoreName === 'sfsp-excludelist-ips') {
        var ipv4Regex = new RegExp(regexPattern.pattern.ipv4);
        var ipv6Regex = new RegExp(regexPattern.pattern.ipv6);
        updatedKeyStoreValue.forEach(function (item) {
          if (!(ipv4Regex.test(item) || ipv6Regex.test(item))) {
            invalidIOCs.push(item);
          }
        });
      } else if (keyStoreName === 'sfsp-excludelist-urls' || keyStoreName === 'sfsp-excludelist-domains' || keyStoreName === 'sfsp-excludelist-ports' || keyStoreName === 'sfsp-excludelist-cidr-ranges') {
        var genericRegex = new RegExp(regexPattern.pattern);
        updatedKeyStoreValue.forEach(function (item) {
          if (!genericRegex.test(item)) {
            invalidIOCs.push(item);
          }
        });
      } else {
        $scope.defaultGlobalSettings[keyStoreName].recordValue = updatedKeyStoreValue;
        return;
      }

      if (invalidIOCs.length > 0) {
        $scope.errorFound['index'] = regexPattern.index;
        $scope.errorFound['status'] = true;
        $scope.errorItem = invalidIOCs.join(', ');
      } else {
        $scope.errorFound['index'] = 0;
        $scope.errorFound['status'] = false;
        $scope.defaultGlobalSettings[keyStoreName].recordValue = updatedKeyStoreValue;
      }
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
