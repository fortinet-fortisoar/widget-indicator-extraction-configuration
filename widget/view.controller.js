/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */

'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('configureIndicatorExtraction110Ctrl', configureIndicatorExtraction110Ctrl);

  configureIndicatorExtraction110Ctrl.$inject = ['$scope', 'widgetUtilityService', '$rootScope', 'widgetBasePath', 'WizardHandler', 'iocExtractionConfigService', 'toaster'];

  function configureIndicatorExtraction110Ctrl($scope, widgetUtilityService, $rootScope, widgetBasePath, WizardHandler, iocExtractionConfigService, toaster) {
    $scope.defaultGlobalSettings = {};
    $scope.initList = [];
    $scope.updatedGlobalSettings = {};
    $scope.widgetCSS = widgetBasePath + 'widgetAssets/css/wizard-style.css';
    $scope.moveNext = moveNext;
    $scope.moveBack = moveBack;
    $scope.isLightTheme = $rootScope.theme.id === 'light';
    $scope.startPageImage = $scope.isLightTheme ? widgetBasePath + 'images/sfsp-start-light.png' : widgetBasePath + 'images/sfsp-start-dark.png';
    $scope._buildPayload = _buildPayload;
    // $scope.modifyGlobalSettings = modifyGlobalSettings;
    $scope.commitGlobalSettings = commitGlobalSettings;
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
            START_PAGE_WZ_TITLE: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_WZ_TITLE'),
            LABEL_TITLE: widgetUtilityService.translate('configureIndicatorExtraction.LABEL_TITLE'),
            START_PAGE_TITLE: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_TITLE'),
            START_PAGE_DESCRIPTION: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_DESCRIPTION'),
            START_PAGE_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.START_PAGE_BUTTON'),


            EXCLUDELIST_CONFIG_PAGE_WZ_TITLE: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_WZ_TITLE'),
            EXCLUDELIST_CONFIG_PAGE_TITLE: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_TITLE'),
            EXCLUDELIST_CONFIG_PAGE_DESCRIPTION: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_DESCRIPTION'),
            EXCLUDELIST_CONFIG_PAGE_IP_ADDRESS_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_IP_ADDRESS_LABEL'),
            EXCLUDELIST_CONFIG_PAGE_IP_ADDRESS_TOOLTIP: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_IP_ADDRESS_TOOLTIP'),
            EXCLUDELIST_CONFIG_PAGE_IP_ADDRESS_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_IP_ADDRESS_PLACEHOLDER'),
            EXCLUDELIST_CONFIG_PAGE_IP_ADDRESS_ERROR_MESSAGE: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_IP_ADDRESS_ERROR_MESSAGE'),
            EXCLUDELIST_CONFIG_PAGE_URL_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_URL_LABEL'),
            EXCLUDELIST_CONFIG_PAGE_URL_TOOLTIP: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_URL_TOOLTIP'),
            EXCLUDELIST_CONFIG_PAGE_URL_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_URL_PLACEHOLDER'),
            EXCLUDELIST_CONFIG_PAGE_URL_ERROR_MESSAGE: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_URL_ERROR_MESSAGE'),
            EXCLUDELIST_CONFIG_PAGE_DOMAIN_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_DOMAIN_LABEL'),
            EXCLUDELIST_CONFIG_PAGE_DOMAIN_TOOLTIP: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_DOMAIN_TOOLTIP'),
            EXCLUDELIST_CONFIG_PAGE_DOMAIN_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_DOMAIN_PLACEHOLDER'),
            EXCLUDELIST_CONFIG_PAGE_DOMAIN_ERROR_MESSAGE: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_DOMAIN_ERROR_MESSAGE'),
            EXCLUDELIST_CONFIG_PAGE_PORTS_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_PORTS_LABEL'),
            EXCLUDELIST_CONFIG_PAGE_PORTS_TOOLTIP: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_PORTS_TOOLTIP'),
            EXCLUDELIST_CONFIG_PAGE_PORTS_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_PORTS_PLACEHOLDER'),
            EXCLUDELIST_CONFIG_PAGE_PORTS_ERROR_MESSAGE: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_PORTS_ERROR_MESSAGE'),
            EXCLUDELIST_CONFIG_PAGE_FILES_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_FILES_LABEL'),
            EXCLUDELIST_CONFIG_PAGE_FILES_TOOLTIP: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_FILES_TOOLTIP'),
            EXCLUDELIST_CONFIG_PAGE_FILES_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_FILES_PLACEHOLDER'),
            EXCLUDELIST_CONFIG_PAGE_CIDR_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_CIDR_LABEL'),
            EXCLUDELIST_CONFIG_PAGE_CIDR_TOOLTIP: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_CIDR_TOOLTIP'),
            EXCLUDELIST_CONFIG_PAGE_CIDR_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_CIDR_PLACEHOLDER'),
            EXCLUDELIST_CONFIG_PAGE_CIDR_ERROR_MESSAGE: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_CIDR_ERROR_MESSAGE'),
            EXCLUDELIST_CONFIG_PAGE_BACK_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BACK_BUTTON'),
            EXCLUDELIST_CONFIG_PAGE_NEXT_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_NEXT_BUTTON'),
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
        var apiPayload = iocExtractionConfigService.constants().createKeyStorePayload;
        apiPayload['key'] = keyName;
        apiPayload['notes'] = 'Enter the ' + (keyName.split('-')[2] === 'range' ? 'CIDR ranges' : keyName.split('-')[2]) + ' that you want to exclude from enrichment.';
        apiPayload['jSONValue'] = keyValue[0].length > 0 ? keyValue : '';
      }
      if (action === 'findKeyStore') {
        var apiPayload = iocExtractionConfigService.constants().findKeyStorePayload;
        apiPayload['filters'][0]['value'] = keyName;
      }
      return apiPayload;
    }


    function _handleGblVarsAndKeyStores() {
      iocExtractionConfigService.getGblVarToKeyStoreMapping(widgetBasePath).then(function (gblVarToKeyStoreMapping) {
        Object.keys(gblVarToKeyStoreMapping).forEach(function (item) {
          if (item === 'CIDR_Range') {
            var payload = _buildPayload('sfsp-excludelist-cidr-ranges', null, 'findKeyStore');
            iocExtractionConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
              if (response && response['hydra:member'] && response['hydra:member'].length === 0) {
                // Check if the keystore record exists for CIDR range; create it if not found
                var keyValue = gblVarToKeyStoreMapping['CIDR_Range'].defaultValue.split(',');
                var payload = _buildPayload('sfsp-excludelist-cidr-ranges', keyValue, 'createKeyStore');
                iocExtractionConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
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
            iocExtractionConfigService.getGBLVariable(item).then(function (response) {
              // Check if exclude list global variable already present 
              if (response && response['hydra:member'] && response['hydra:member'].length > 0) {
                var gblVarName = response['hydra:member'][0].name;
                var gblVarID = response['hydra:member'][0].id;
                var keyName = gblVarToKeyStoreMapping[gblVarName].keystore;
                var keyValue = [...new Set(response['hydra:member'][0].value.split(','))];
                var payload = _buildPayload(keyName, keyValue, 'createKeyStore');
                iocExtractionConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                  $scope.defaultGlobalSettings[res.key] = { 'recordValue': res.jSONValue, 'recordUUID': res.uuid };
                });
                iocExtractionConfigService.deleteGBLVariable(gblVarID);
              }
              else {
                var keyName = gblVarToKeyStoreMapping[item].keystore;
                var payload = _buildPayload(keyName, null, 'findKeyStore');
                iocExtractionConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
                  if (response && response['hydra:member'] && response['hydra:member'].length > 0) {
                    $scope.defaultGlobalSettings[response['hydra:member'][0].key] = { 'recordValue': response['hydra:member'][0].jSONValue, 'recordUUID': response['hydra:member'][0].uuid };
                  }
                  else {
                    var keyName = gblVarToKeyStoreMapping[item].keystore;
                    var keyValue = gblVarToKeyStoreMapping[item].defaultValue.split(',');
                    var payload = _buildPayload(keyName, keyValue, 'createKeyStore');
                    iocExtractionConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
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

      if (keyStoreName === 'sfsp-excludelist-ips') {
        $scope.invalidIPs = [];
        var ipv4Regex = new RegExp(regexPattern.pattern.ipv4);
        var ipv6Regex = new RegExp(regexPattern.pattern.ipv6);
        updatedKeyStoreValue.forEach(function (item) {
          if (!(ipv4Regex.test(item) || ipv6Regex.test(item))) {
            $scope.invalidIPs.push(item);
            var index = $scope.updatedGlobalSettings[keyStoreName].recordValue.indexOf(item);
            if (index !== -1) {
              $scope.updatedGlobalSettings[keyStoreName].recordValue.splice(index, 1);
              console.log($select.selected);
              console.log($scope.updatedGlobalSettings);
            }
          }
        });
      } else if (keyStoreName === 'sfsp-excludelist-urls'){
        $scope.invalidURLs = [];
        var urlRegex = new RegExp(regexPattern.pattern);
        updatedKeyStoreValue.forEach(function (item) {
          if (!urlRegex.test(item)) {
            $scope.invalidURLs.push(item);
          }
        });
      } else if (keyStoreName === 'sfsp-excludelist-domains'){
        $scope.invalidDomains = [];
        var domainRegex = new RegExp(regexPattern.pattern);
        updatedKeyStoreValue.forEach(function (item) {
          if (!domainRegex.test(item)) {
            $scope.invalidDomains.push(item);
          }
        });
      }else if (keyStoreName === 'sfsp-excludelist-ports'){
        $scope.invalidPorts = [];
        var portsRegex = new RegExp(regexPattern.pattern);
        updatedKeyStoreValue.forEach(function (item) {
          if (!portsRegex.test(item)) {
            $scope.invalidPorts.push(item);
          }
        });
      }else if (keyStoreName === 'sfsp-excludelist-cidr-ranges'){
        $scope.invalidCIDRs = [];
        var cidrRegex = new RegExp(regexPattern.pattern);
        updatedKeyStoreValue.forEach(function (item) {
          if (!cidrRegex.test(item)) {
            $scope.invalidCIDRs.push(item);
          }
        });
      }
    }


    function moveNext() {
      var currentStepTitle = WizardHandler.wizard('configureIndicatorExtraction').currentStep().wzTitle
      if (currentStepTitle === 'Start') {
        if (Object.keys($scope.updatedGlobalSettings).length === 0) {
          $scope.updatedGlobalSettings = angular.copy($scope.defaultGlobalSettings);
        }
      }
      if (currentStepTitle === 'Excludelist Settings') {
        commitGlobalSettings();
      }
      WizardHandler.wizard('configureIndicatorExtraction').next();
    }


    function moveBack() {
      WizardHandler.wizard('configureIndicatorExtraction').previous();
    }


    // function modifyGlobalSettings(updatedKeyStoreValue, keyStoreName) {
    //   $scope.updatedGlobalSettings[keyStoreName].recordValue = updatedKeyStoreValue;
    // }


    function commitGlobalSettings() {
      Object.keys($scope.updatedGlobalSettings).forEach(function (item) {
        var keyValue = $scope.updatedGlobalSettings[item].recordValue;
        var uuid = $scope.updatedGlobalSettings[item].recordUUID;
        iocExtractionConfigService.updateKeyStoreRecord(keyValue, uuid);
      });
    }


    function init() {
      // To set value to be displayed on "Excludelist Settings" page
      _handleGblVarsAndKeyStores();
      // To handle backward compatibility for widget
      _handleTranslations();
    }

    init();
  }
})();
