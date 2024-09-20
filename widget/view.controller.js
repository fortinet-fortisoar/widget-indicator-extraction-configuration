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
    $scope.isLightTheme = $rootScope.theme.id === 'light';
    $scope.invalidIOCs = {}; // This dict holds invalid IOCs for various indicator types


    // File Paths
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
    $scope._getRegexPattern = _getRegexPattern;
    $scope._getKeyStoreValue = _getKeyStoreValue;
    $scope.bulkImportStatus = bulkImportStatus;


    function bulkImportStatus(importStatus) {
      $scope.importStatus = importStatus;
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
            EXCLUDELIST_CONFIG_PAGE_SEARCH_PLACEHOLDER: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_SEARCH_PLACEHOLDER'),
            EXCLUDELIST_CONFIG_PAGE_SEARCH_RESULT_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_SEARCH_RESULT_LABEL'),
            EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_LABEL'),
            EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_BUTTON'),
            EXCLUDELIST_CONFIG_PAGE_ADD_INDICATOR_TYPE_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_ADD_INDICATOR_TYPE_BUTTON'),
            EXCLUDELIST_CONFIG_PAGE_BACK_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BACK_BUTTON'),
            EXCLUDELIST_CONFIG_PAGE_NEXT_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_NEXT_BUTTON')
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
        apiPayload['jSONValue'] = keyValue;
      }
      if (action === 'findKeyStore') {
        var apiPayload = iocExtractionConfigService.constants().findKeyStorePayload;
        apiPayload['filters'][0]['value'] = keyName;
      }
      return apiPayload;
    }


    function _getRegexPattern(indicatorType, regexMapping) {
      let mapping = {
        'IP Address': ['IPv4', 'IPv6'],
        'File Hash': ['MD5', 'SHA1', 'SHA256'],
        'CIDR Range': ['CIDR'],
        'Domain': ['Host']
      };
      return (mapping[indicatorType] || [indicatorType]).map(key => regexMapping[key]);
    }


    function _getKeyStoreValue(keyStoreName, regexDict) {
      let [globalVariable, type, defaultKeyStore] = iocExtractionConfigService.constants().globalVariablesToKeyStoreMapping[keyStoreName];
      return {
        globalVariable,
        type,
        defaultKeyStore,
        iocValues: [],
        pattern: _getRegexPattern(type, regexDict)
      };
    }


    function _handleGblVarsAndKeyStores() {
      // Fetch regex mappings for different indicator types using Utilities connector
      iocExtractionConfigService.getIndicatorRegex().then(function (regexMapping) {
        // Create a dictionary to map indicator types to regex patterns
        let regexDict = regexMapping.data.reduce(function (acc, item) {
          acc[item.indicator_type] = item.regx.replace(/\\\\/g, '\\'); // Normalizing the JSON response from the utilities connector by replacing escape characters in the encoded regex
          return acc;
        }, {});

        // Build payload to fetch all the key store records associated with excludelist
        let keyName = '%sfsp-excludelist%';
        let payload = _buildPayload(keyName, null, 'findKeyStore');

        // Fetch key store records based on the payload
        iocExtractionConfigService.getKeyStoreRecord(payload, 'keys').then(function (keystoreDetails) {
          if (keystoreDetails && keystoreDetails['hydra:member'] && keystoreDetails['hydra:member'].length > 0) {
            // Process each key store record
            keystoreDetails['hydra:member'].forEach(function (item) {
              let keyStoreName = item.key;
              let keyStoreValue = _getKeyStoreValue(keyStoreName, regexDict);

              // Fetch global variable details for the corresponding key store value
              iocExtractionConfigService.getGlobalVariable(keyStoreValue.globalVariable).then(function (gblVariableDetails) {

                // Check if global variables exist for the key store
                if (gblVariableDetails && gblVariableDetails['hydra:member'] && gblVariableDetails['hydra:member'].length > 0) {
                  let globalVariableValue = gblVariableDetails['hydra:member'][0].value.length > 0 ? [...new Set(gblVariableDetails['hydra:member'][0].value.split(','))] : []; // Get the value of the global variable as an array
                  keyStoreValue['iocValues'] = globalVariableValue; // Assign global variable values to key store

                  // Build payload to update global variable values to key store
                  let payload = _buildPayload(keyStoreName, keyStoreValue, 'createKeyStore');

                  iocExtractionConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {

                    // Verify if the global variable value was correctly migrated to the key store
                    if (res.jSONValue.iocValues.sort().toString() === globalVariableValue.sort().toString()) {
                      $scope.defaultGlobalSettings[res.key] = { 'recordUUID': res.uuid, 'recordValue': res.jSONValue };
                    }
                  });
                }
                else if (Array.isArray(item.jSONValue)) {
                  // If key store record already exists and has JSON values, assign it to the key store
                  keyStoreValue['iocValues'] = item.jSONValue;
                  let payload = _buildPayload(keyStoreName, keyStoreValue, 'createKeyStore');
                  iocExtractionConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                    $scope.defaultGlobalSettings[res.key] = { 'recordUUID': res.uuid, 'recordValue': res.jSONValue };
                  });
                }
                else {
                  // If no global variable exists and JSON values are not an array then simply update the settings
                  $scope.defaultGlobalSettings[keyStoreName] = { 'recordUUID': item.uuid, 'recordValue': item.jSONValue };
                }
              });
            });
          }
        });
      });
    }


    function updateSearchQuery(searchStringValue) {
      $scope.searchStatus = 'on';
      $scope.searchString = searchStringValue;
      $scope.globalSearchList = {}; // Contains search result
      $scope.searchResultCount = 0; // This variable counts the search results found
      if (searchStringValue.length > 0) {
        Object.keys($scope.updatedGlobalSettings).forEach(function (item) {
          if (item.includes('excludelist') && $scope.updatedGlobalSettings[item].recordValue.iocValues.length > 0) {
            const filteredList = $scope.updatedGlobalSettings[item].recordValue.iocValues.filter(function (iocValue) {
              return iocValue.includes(searchStringValue);
            });
            if (filteredList.length > 0) {
              $scope.searchResultCount = $scope.searchResultCount + filteredList.length;
              $scope.globalSearchList[item] = { 'type': $scope.updatedGlobalSettings[item].recordValue.type, 'filteredValues': filteredList };
            }
          }
        });
      }
    }


    function setSearchStatus(status) {
      $scope.searchStatus = status;
      if (status === 'off') {
        $timeout(function () {
          $scope.searchString = '';
        }, 0);
      }
    }


    function validateIOC(updatedKeyStoreValue, keyStoreName) {
      if ($scope.updatedGlobalSettings[keyStoreName].recordValue.pattern.length > 0) {
        let regexPattern = $scope.updatedGlobalSettings[keyStoreName].recordValue.pattern;
        let regExObjects = regexPattern.map(pattern => new RegExp(pattern)); // Creates an array of RegExp objects

        let _tempInvalidIOCs = updatedKeyStoreValue.filter(item => {
          // Checks if IOC matches any regex pattern
          return !regExObjects.some(regex => regex.test(item));
        });

        if (_tempInvalidIOCs.length > 0) {
          $scope.invalidIOCs[keyStoreName] = _tempInvalidIOCs.join(', ');
        } else {
          delete $scope.invalidIOCs[keyStoreName];
        }

        $scope.isInvalidIOCsNotEmpty = function () {
          return Object.keys($scope.invalidIOCs).length > 0;
        };
      }
    }


    function moveNext() {
      let currentStepTitle = WizardHandler.wizard('configureIndicatorExtraction').currentStep().wzTitle
      if (currentStepTitle === 'Start') {
        if (Object.keys($scope.updatedGlobalSettings).length === 0) {
          $scope.updatedGlobalSettings = angular.copy($scope.defaultGlobalSettings);
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
        let keyValue = $scope.updatedGlobalSettings[item].recordValue;
        let uuid = $scope.updatedGlobalSettings[item].recordUUID;
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
