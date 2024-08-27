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
    // Initialization variables
    $scope.defaultGlobalSettings = {};
    $scope.updatedGlobalSettings = {};
    $scope.initList = [];
    $scope.searchString = '';
    $scope.searchStatus = 'off';
    $scope.globalSearchList = [];
    $scope.isLightTheme = $rootScope.theme.id === 'light';
    $scope.invalidIOCs = {}; // This dict holds invalid IOCs for various indicator types
    var regexPatternMapping = {};

    // File Import Paths
    $scope.widgetCSS = widgetBasePath + 'widgetAssets/css/wizard-style.css';
    $scope.startPageImage = $scope.isLightTheme ? widgetBasePath + 'images/sfsp-start-light.png' : widgetBasePath + 'images/sfsp-start-dark.png';
    $scope.excludeIOCPageImage = widgetBasePath + 'images/sfsp-global-settings.png';
    $scope.finishPageImage = widgetBasePath + 'images/finish.png';

    // Functions 
    $scope._buildPayload = _buildPayload;
    $scope.moveNext = moveNext;
    $scope.moveBack = moveBack;
    $scope.commitGlobalSettings = commitGlobalSettings;
    $scope.validateIOC = validateIOC;
    $scope.setSearchStatus = setSearchStatus;
    $scope.updateSearchQuery = updateSearchQuery;


    function updateSearchQuery(searchStringValue) {
      $scope.searchStatus = 'on';
      $scope.searchString = searchStringValue;
      console.log($scope.searchString);
    }

    function setSearchStatus(status) {
      $scope.searchStatus = status;
    }

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

    function _buildPayload(keyName, keyValue, notes, action) {
      if (action === 'createKeyStore') {
        var apiPayload = iocExtractionConfigService.constants().createKeyStorePayload;
        apiPayload['key'] = keyName;
        apiPayload['notes'] = notes;
        apiPayload['jSONValue'] = keyName === 'sfsp-indicator-type-mapping' ? keyValue : (keyValue[0].length > 0 ? keyValue : '');
        console.log(apiPayload);
      }
      if (action === 'findKeyStore') {
        var apiPayload = iocExtractionConfigService.constants().findKeyStorePayload;
        apiPayload['filters'][0]['value'] = keyName;
        console.log(apiPayload);
      }
      return apiPayload;
    }


    function _handleGblVarsAndKeyStores() {
      iocExtractionConfigService.getKeyStoreMetadata(widgetBasePath).then(function (gblVarToKeyStoreMapping) {
        Object.keys(gblVarToKeyStoreMapping).forEach(function (item) {
          if (item === 'CIDR_Range') {
            var payload = _buildPayload('sfsp-excludelist-cidr-ranges', null, null, 'findKeyStore');
            iocExtractionConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
              if (response && response['hydra:member'] && response['hydra:member'].length === 0) {
                // Check if the keystore record exists for CIDR range them create the same
                var keyValue = gblVarToKeyStoreMapping['CIDR_Range'].defaultValue.split(',');
                var notes = gblVarToKeyStoreMapping['CIDR_Range'].notes;
                var type = gblVarToKeyStoreMapping[item].type;
                var payload = _buildPayload('sfsp-excludelist-cidr-ranges', keyValue, notes, 'createKeyStore');
                iocExtractionConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                  // Create keystore record for CIDR Ranges
                  $scope.defaultGlobalSettings[res.key] = { 'recordValue': res.jSONValue, 'recordUUID': res.uuid, 'type': type };
                });
              }
              else {
                var type = gblVarToKeyStoreMapping[item].type;
                $scope.defaultGlobalSettings[response['hydra:member'][0].key] = { 'recordValue': response['hydra:member'][0].jSONValue, 'recordUUID': response['hydra:member'][0].uuid, 'type': type };
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
                if (gblVarName === 'Indicator_Type_Map') {
                  var _temp = gblVarToKeyStoreMapping[gblVarName].defaultValue;
                  _temp['field_mapping'] = JSON.parse(response['hydra:member'][0].value);
                  var keyValue = _temp;
                } else {
                  var keyValue = [...new Set(response['hydra:member'][0].value.split(','))];
                }
                var notes = gblVarToKeyStoreMapping[gblVarName].notes;
                var payload = _buildPayload(keyName, keyValue, notes, 'createKeyStore');
                iocExtractionConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                  var type = gblVarToKeyStoreMapping[item].type;
                  $scope.defaultGlobalSettings[res.key] = { 'recordValue': res.jSONValue, 'recordUUID': res.uuid, 'type': type };
                });
                iocExtractionConfigService.deleteGBLVariable(gblVarID);
              }
              else {
                var keyName = gblVarToKeyStoreMapping[item].keystore;
                var payload = _buildPayload(keyName, null, null, 'findKeyStore');
                iocExtractionConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
                  if (response && response['hydra:member'] && response['hydra:member'].length > 0) {
                    var type = gblVarToKeyStoreMapping[item].type;
                    $scope.defaultGlobalSettings[response['hydra:member'][0].key] = { 'recordValue': response['hydra:member'][0].jSONValue, 'recordUUID': response['hydra:member'][0].uuid, 'type': type };
                  }
                  else {
                    var keyName = gblVarToKeyStoreMapping[item].keystore;
                    var keyValue = item === 'Indicator_Type_Map' ? gblVarToKeyStoreMapping[item].defaultValue : gblVarToKeyStoreMapping[item].defaultValue.split(',');
                    var notes = gblVarToKeyStoreMapping[item].notes;
                    var payload = _buildPayload(keyName, keyValue, notes, 'createKeyStore');
                    iocExtractionConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                      var type = gblVarToKeyStoreMapping[item].type;
                      $scope.defaultGlobalSettings[res.key] = { 'recordValue': res.jSONValue, 'recordUUID': res.uuid, 'type': type };
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
      var _tempInvalidIOCs = [];

      if (keyStoreName === 'sfsp-excludelist-ips') {
        var ipv4Regex = new RegExp(regexPattern.pattern.ipv4);
        var ipv6Regex = new RegExp(regexPattern.pattern.ipv6);
        _tempInvalidIOCs = updatedKeyStoreValue.filter(function (item) {
          return !(ipv4Regex.test(item) || ipv6Regex.test(item));
        });
      } else {
        var iocRegex = new RegExp(regexPattern.pattern);
        _tempInvalidIOCs = updatedKeyStoreValue.filter(function (item) {
          return !(iocRegex.test(item));
        });
      }

      if (_tempInvalidIOCs.length > 0) {
        $scope.invalidIOCs[keyStoreName] = _tempInvalidIOCs.join(', ');
      } else {
        delete $scope.invalidIOCs[keyStoreName];
      }

      $scope.isInvalidIOCsNotEmpty = function () {
        return Object.keys($scope.invalidIOCs).length > 0;
      };
      console.log($scope.isInvalidIOCsNotEmpty);
    }


    function moveNext() {
      var currentStepTitle = WizardHandler.wizard('configureIndicatorExtraction').currentStep().wzTitle
      if (currentStepTitle === 'Start') {
        if (Object.keys($scope.updatedGlobalSettings).length === 0) {
          $scope.updatedGlobalSettings = angular.copy($scope.defaultGlobalSettings);
          Object.keys($scope.updatedGlobalSettings).forEach(function (item) {
            if (item.includes('excludelist') && $scope.updatedGlobalSettings[item].recordValue.length > 0) {
              $scope.updatedGlobalSettings[item].recordValue.forEach(function (iocVal) {
                $scope.globalSearchList.push({ 'keyStoreName': item, 'iocValue': iocVal, 'type': $scope.updatedGlobalSettings[item].type });
              });
            }
          });
          console.log($scope.updatedGlobalSettings);
          console.log($scope.globalSearchList);
        }
      }
      if (currentStepTitle === 'Excludelist Configuration') {
        commitGlobalSettings();
      }
      WizardHandler.wizard('configureIndicatorExtraction').next();
    }


    function moveBack() {
      WizardHandler.wizard('configureIndicatorExtraction').previous();
    }


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
