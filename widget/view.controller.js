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
    // $scope.setSearchStatus = setSearchStatus;
    // $scope.updateSearchQuery = updateSearchQuery;


    // function updateSearchQuery(searchStringValue) {
    //   $scope.searchStatus = 'on';
    //   $scope.searchString = searchStringValue;
    //   console.log($scope.searchString);
    // }

    // function setSearchStatus(status) {
    //   $scope.searchStatus = status;
    // }

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
        apiPayload['jSONValue'] = keyValue;
        // apiPayload['jSONValue'] = keyName === 'sfsp-indicator-type-mapping' ? keyValue : (keyValue[0].length > 0 ? keyValue : '');
      }
      if (action === 'findKeyStore') {
        var apiPayload = iocExtractionConfigService.constants().findKeyStorePayload;
        apiPayload['filters'][0]['value'] = keyName;
      }
      return apiPayload;
    }


    function _handleGblVarsAndKeyStores() {
      var payload = _buildPayload('%sfsp-excludelist%', null, 'findKeyStore');
      iocExtractionConfigService.getKeyStoreRecord(payload, 'keys').then(function (keystoreDetails) {
        if (keystoreDetails && keystoreDetails['hydra:member'] && keystoreDetails['hydra:member'].length > 0) {
          keystoreDetails['hydra:member'].forEach(function (item) {

            // Check if the global variables exists
            if (item.jSONValue.globalVariable.length > 0) {

              // Move global variable value to keystore and delete the global variable
              iocExtractionConfigService.getGlobalVariable(item.jSONValue.globalVariable).then(function (gblVariableDetails) {
                if (gblVariableDetails && gblVariableDetails['hydra:member'] && gblVariableDetails['hydra:member'].length > 0) {
                  var keyStoreValue = item.jSONValue;
                  var gblVarID = gblVariableDetails['hydra:member'][0].id;
                  keyStoreValue['values'] = gblVariableDetails['hydra:member'][0].value.length > 0 ? [...new Set(gblVariableDetails['hydra:member'][0].value.split(','))] : '';
                  var payload = _buildPayload(item.key, keyStoreValue, 'createKeyStore');
                  iocExtractionConfigService.createOrUpdateKeyStore(payload, 'keys').then(function (res) {
                    $scope.defaultGlobalSettings[res.key] = { 'recordUUID': res.uuid, 'recordValue': res.jSONValue };
                  });
                  iocExtractionConfigService.deleteGlobalVariable(gblVarID);
                }
                else {
                  $scope.defaultGlobalSettings[item.key] = { 'recordUUID': item.uuid, 'recordValue': item.jSONValue };
                }
              });
            }
            else {
              $scope.defaultGlobalSettings[item.key] = { 'recordUUID': item.uuid, 'recordValue': item.jSONValue };
            }
          });
        }
      });
    }

    function validateIOC(updatedKeyStoreValue, keyStoreName) {
      var regexPattern = $scope.updatedGlobalSettings[keyStoreName].recordValue.pattern;
      var _tempInvalidIOCs = [];

      if (keyStoreName === 'sfsp-excludelist-ips') {
        var ipv4Regex = new RegExp(regexPattern.ipv4);
        var ipv6Regex = new RegExp(regexPattern.ipv6);
        _tempInvalidIOCs = updatedKeyStoreValue.filter(function (item) {
          return !(ipv4Regex.test(item) || ipv6Regex.test(item));
        });
      } else {
        var iocRegex = new RegExp(regexPattern);
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
    }


    function moveNext() {
      var currentStepTitle = WizardHandler.wizard('configureIndicatorExtraction').currentStep().wzTitle
      if (currentStepTitle === 'Start') {
        if (Object.keys($scope.updatedGlobalSettings).length === 0) {
          $scope.updatedGlobalSettings = angular.copy($scope.defaultGlobalSettings);
          // Object.keys($scope.updatedGlobalSettings).forEach(function (item) {
          //   if (item.includes('excludelist') && $scope.updatedGlobalSettings[item].recordValue.length > 0) {
          //     $scope.updatedGlobalSettings[item].recordValue.forEach(function (iocVal) {
          //       $scope.globalSearchList.push({ 'keyStoreName': item, 'iocValue': iocVal, 'type': $scope.updatedGlobalSettings[item].type });
          //     });
          //   }
          // });
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
