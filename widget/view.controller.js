/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */

'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('configureIndicatorExtraction110Ctrl', configureIndicatorExtraction110Ctrl);

  configureIndicatorExtraction110Ctrl.$inject = ['$scope', 'widgetUtilityService', '$rootScope', 'widgetBasePath', 'WizardHandler', 'iocExtractionConfigService', 'toaster', 'Upload', 'API'];

  function configureIndicatorExtraction110Ctrl($scope, widgetUtilityService, $rootScope, widgetBasePath, WizardHandler, iocExtractionConfigService, toaster, Upload, API) {
    // Initialization variables
    $scope.defaultGlobalSettings = {};
    $scope.defaultExclusionSettings = {};
    $scope.updatedExclusionSettings = {};
    $scope.defaultIOCTypeFieldMapping = {};
    $scope.updatedIOCTypeFieldMapping = {};
    $scope.initList = [];
    $scope.searchString = '';
    $scope.searchStatus = 'off';
    $scope.isLightTheme = $rootScope.theme.id === 'light';
    $scope.isSteelTheme = $rootScope.theme.id === 'steel';
    $scope.invalidIOCs = {}; // This dict holds invalid IOCs for various indicator types
    $scope.fileName = '';
    $scope.uploadedFileFlag = false;
    $scope.loadingJob = false;
    $scope.defaultIOCTypeList = [];
    $scope.notYetEnteredIOCTypes = ['Add Custom Indicator Type'];
    $scope.selectedIndicatorType = { iocType: '', pattern: [] };
    $scope.addCustomIOCType = false;
    $scope.isSystemIOCType = true;
    $scope.iocTypeSelected = false;
    const maxFileSize = 25072682;
    var regexDict = {};


    // File Paths
    $scope.widgetCSS = widgetBasePath + 'widgetAssets/css/wizard-style.css';
    $scope.pageImages = {
      'startPageImage': $scope.isLightTheme ? widgetBasePath + 'images/ioc-extraction-start-light.png' : widgetBasePath + 'images/ioc-extraction-start-dark.png',
      'excludeIOCPageImage': $scope.isLightTheme ? widgetBasePath + 'images/ioc-extraction-exclusion-light.png' : widgetBasePath + 'images/ioc-extraction-exclusion-dark.png',
      'fieldMappingPageImage': $scope.isLightTheme ? widgetBasePath + 'images/ioc-extraction-field-map-light.png' : widgetBasePath + 'images/ioc-extraction-field-map-dark.png',
      'finishPageImage': widgetBasePath + 'images/ioc-extraction-finish-both.png'
    };

    // Functions
    $scope._buildPayload = _buildPayload;
    $scope.moveNext = moveNext;
    $scope.moveBack = moveBack;
    $scope.commitExclusionSettings = commitExclusionSettings;
    $scope.validateIOC = validateIOC;
    $scope.setSearchStatus = setSearchStatus;
    $scope.updateSearchQuery = updateSearchQuery;
    $scope._getRegexPattern = _getRegexPattern;
    $scope.uploadFiles = uploadFiles;
    $scope.setBulkImportFlags = setBulkImportFlags;
    $scope.setAddNewIOCFlags = setAddNewIOCFlags;
    $scope.getNotEnteredIOCTypes = getNotEnteredIOCTypes;
    $scope.indicatorTypeChanged = indicatorTypeChanged;
    $scope.saveNewIOCType = saveNewIOCType;


    function saveNewIOCType() {
      let keyStoreTemplate = iocExtractionConfigService.constants().keyStoreTemplate;
      let iocTypeName = $scope.selectedIndicatorType.iocType;
      keyStoreTemplate['pattern'].push($scope.selectedIndicatorType.pattern);
      if ($scope.addCustomIOCType){
        keyStoreTemplate['category'] = 'custom';
      }
      $scope.updatedExclusionSettings.recordValue[iocTypeName] = keyStoreTemplate;
      console.log($scope.updatedExclusionSettings);
      setAddNewIOCFlags('addNewIOCTypeOFF');
    }


    function indicatorTypeChanged(iocType) {
      $scope.iocTypeSelected = true;
      if (iocType === 'Add Custom Indicator Type') {
        $scope.isSystemIOCType = false;
        $scope.addCustomIOCType = true;
        $scope.selectedIndicatorType = { iocType: '', pattern: [] };
      } else {
        $scope.addCustomIOCType = false;
        $scope.isSystemIOCType = true;
        $scope.selectedIndicatorType['pattern'] = _getRegexPattern(iocType, regexDict).join(',');
        if ($scope.selectedIndicatorType['pattern'].length === 0) {
          $scope.isSystemIOCType = false;
        }
        console.log('test');
      }
    }

    function setAddNewIOCFlags(flag) {
      if (flag === 'addNewIOCTypeON') {
        $scope.addNewIndicatorType = true;
      }
      if (flag === 'addNewIOCTypeOFF') {
        $scope.addNewIndicatorType = false;
        $scope.selectedIndicatorType = { iocType: '', pattern: [] };
        $scope.addCustomIOCType = false;
        $scope.isSystemIOCType = true;
      }
    }

    function getNotEnteredIOCTypes() {
      iocExtractionConfigService.getPicklist().then(function (response) {
        let alreadyEnteredIOCTypes = Object.keys($scope.defaultExclusionSettings.recordValue);
        let defaultIOCTypeList = response.picklists.map(function (item) {
          if (item.itemValue.includes("FileHash")) {
            return "File Hash";
          }
          return item.itemValue;
        });

        let unCommonElements = defaultIOCTypeList.filter(function (item) {
          if (item !== "CIDR Range") {
            return alreadyEnteredIOCTypes.indexOf(item) === -1;
          }
        });
        $scope.notYetEnteredIOCTypes = Array.from(new Set(unCommonElements.concat($scope.notYetEnteredIOCTypes)));
        console.log(defaultIOCTypeList);
        console.log('alreadyEnteredIOCTypes');
      });
    }


    function setBulkImportFlags(flag) {
      const resetFileUpload = () => {
        $scope.uploadedFileFlag = false;
        $scope.loadingJob = false;
        $scope.fileName = '';
      }
      if (flag === 'bulkImportOn') {
        $scope.bulkImportOn = true;
      }
      if (flag === 'bulkImportOff') {
        $scope.bulkImportOn = false;
        resetFileUpload();
      }
      if (flag === 'resetFileUpload') {
        resetFileUpload();
      }
    }


    function uploadFiles(file) {
      if (file.size < maxFileSize) {
        if (file.type) {
          file.upload = Upload.upload({
            url: API.BASE + 'files',
            data: {
              file: file
            }
          });
          $scope.enableSpinner = true;
          $scope.loadingJob = true;
          file.upload.then(function (response) {
            $scope.fileMetadata = response.data;
            $scope.fileName = response.data.filename;
            $scope.loadingJob = false;
            $scope.uploadedFileFlag = true;
            $scope.enableSpinner = false;
            // if ($scope.showCreatedSolutions === 'created') {
            //   submitContentFormService.triggerPlaybook($scope);
            // }
          },
            function (response) {
              $scope.loadingJob = false;
              $scope.enableSpinner = false;
              if (response.status > 0) {
                $log.debug(response.status + ': ' + response.data);
              }
              var message = $scope.viewWidgetVars.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_UPLOAD_FAILED;
              if (response.status === 413) {
                message = $scope.viewWidgetVars.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_FILE_SIZE_EXCEEDED;
              }
              $scope.enableSpinner = false;
              toaster.error({ body: message });
            });
        }
      }
      else {
        $scope.enableSpinner = false;
        toaster.error({ body: $scope.viewWidgetVars.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_FILE_SIZE_EXCEEDED });
      }
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
            EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_LAUNCH_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_LAUNCH_BUTTON'),
            EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_FILE_IMPORT_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_FILE_IMPORT_BUTTON'),
            EXCLUDELIST_CONFIG_PAGE_CANCEL_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_CANCEL_BUTTON'),

            EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_UPLOAD_FAILED: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_UPLOAD_FAILED'),
            EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_FILE_SIZE_EXCEEDED: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_FILE_SIZE_EXCEEDED'),
            EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_FILE_TYPE_NOT_SUPPORTED: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_FILE_TYPE_NOT_SUPPORTED'),
            EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_UPLOADER_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_UPLOADER_LABEL'),
            EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_DROP_A_FILE: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_DROP_A_FILE'),
            EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_USE_STANDARD_UPLOADER: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_USE_STANDARD_UPLOADER'),
            EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_FILE_SIZE_SHOULD_NOT_EXCEED_25MB: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BULK_IMPORT_FILE_SIZE_SHOULD_NOT_EXCEED_25MB'),

            EXCLUDELIST_CONFIG_PAGE_ADD_IOC_TYPE_LAUNCH_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_ADD_IOC_TYPE_LAUNCH_BUTTON'),
            EXCLUDELIST_CONFIG_PAGE_ADD_IOC_TYPE_FORM_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_ADD_IOC_TYPE_FORM_LABEL'),
            EXCLUDELIST_CONFIG_PAGE_ADD_IOC_TYPE_SELECT_INDICATOR_LABEL: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_ADD_IOC_TYPE_SELECT_INDICATOR_LABEL'),

            SELECT_AN_OPTION: widgetUtilityService.translate('configureIndicatorExtraction.SELECT_AN_OPTION'),
            EXCLUDELIST_CONFIG_PAGE_BACK_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_BACK_BUTTON'),
            EXCLUDELIST_CONFIG_PAGE_SAVE_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_SAVE_BUTTON'),
            EXCLUDELIST_CONFIG_PAGE_SKIP_BUTTON: widgetUtilityService.translate('configureIndicatorExtraction.EXCLUDELIST_CONFIG_PAGE_SKIP_BUTTON'),
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
        'Domain': ['Host'],
        'Email Address': ['Email']
      };
      return (mapping[indicatorType] || [indicatorType]).map(key => regexMapping[key]);
    }


    function _initExclusionSetting() {
      // Fetch regex mappings for different indicator types using Regex Keystore
      let keyName = 'sfsp-indicator-regex-mapping';
      let payload = _buildPayload(keyName, null, 'findKeyStore');
      iocExtractionConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
        // Create a dictionary to map indicator types to regex patterns 
        if (response && response['hydra:member'] && response['hydra:member'].length > 0) {
          let regexMapping = response["hydra:member"][0].jSONValue;
          regexDict = regexMapping.reduce(function (acc, item) {
            acc[item.indicator_type] = item.pattern_regx.replace(/\\\\/g, '\\'); // Normalizing the JSON response from the utilities connector by replacing escape characters in the encoded regex
            return acc;
          }, {});
          console.log(regexDict);
        }

        // Build payload to fetch exclusion data for all the indicator types available in keystore
        let keyStoreName = 'sfsp-indicator-extraction-configuration';
        let payload = _buildPayload(keyStoreName, null, 'findKeyStore');

        // Fetch key store record based on the payload
        iocExtractionConfigService.getKeyStoreRecord(payload, 'keys').then(function (response) {
          if (response && response['hydra:member'] && response['hydra:member'].length > 0) {

            // Process each key in keystore record
            let keystoreDetails = response['hydra:member'][0].jSONValue;
            $scope.defaultGlobalSettings = keystoreDetails;
            $scope.defaultExclusionSettings = { 'recordUUID': response['hydra:member'][0].uuid, 'recordValue': {} };
            $scope.defaultIOCTypeFieldMapping = { 'recordUUID': response['hydra:member'][0].uuid, 'recordValue': {} };
            Object.keys(keystoreDetails).forEach(function (indicatorType) {
              if (indicatorType === 'Indicator Type Mapping') {
                $scope.defaultIOCTypeFieldMapping.recordValue = keystoreDetails[indicatorType];
              } else {
                let iocExclusionDetails = keystoreDetails[indicatorType]
                iocExclusionDetails.pattern = _getRegexPattern(indicatorType, regexDict);
                $scope.defaultExclusionSettings.recordValue[indicatorType] = iocExclusionDetails;
                console.log(regexDict);
              }
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
        Object.keys($scope.updatedExclusionSettings.recordValue).forEach(function (indicatorType) {
          if ($scope.updatedExclusionSettings.recordValue[indicatorType].excludedIOCs.length > 0) {
            const filteredList = $scope.updatedExclusionSettings.recordValue[indicatorType].excludedIOCs.filter(function (iocValue) {
              return iocValue.includes(searchStringValue);
            });
            if (filteredList.length > 0) {
              $scope.searchResultCount = $scope.searchResultCount + filteredList.length;
              $scope.globalSearchList[indicatorType] = { 'type': indicatorType, 'filteredValues': filteredList };
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


    function validateIOC(updatedKeyStoreValue, indicatorType) {
      if ($scope.updatedExclusionSettings.recordValue[indicatorType].pattern.length > 0) {
        let regexPattern = $scope.updatedExclusionSettings.recordValue[indicatorType].pattern;
        let regExObjects = regexPattern.map(pattern => new RegExp(pattern)); // Creates an array of RegExp objects

        let _tempInvalidIOCs = updatedKeyStoreValue.filter(item => {
          // Checks if IOC matches any regex pattern
          return !regExObjects.some(regex => regex.test(item));
        });

        if (_tempInvalidIOCs.length > 0) {
          $scope.invalidIOCs[indicatorType] = _tempInvalidIOCs.join(', ');
        } else {
          delete $scope.invalidIOCs[indicatorType];
        }

        $scope.isInvalidIOCsNotEmpty = function () {
          return Object.keys($scope.invalidIOCs).length > 0;
        };
      }
    }


    function moveNext(param) {
      let currentStepTitle = WizardHandler.wizard('configureIndicatorExtraction').currentStep().wzTitle
      if (currentStepTitle === 'Start') {
        if (Object.keys($scope.updatedExclusionSettings).length === 0) {
          $scope.updatedExclusionSettings = angular.copy($scope.defaultExclusionSettings);
          $scope.updatedIOCTypeFieldMapping = angular.copy($scope.defaultIOCTypeFieldMapping);
        }
        getNotEnteredIOCTypes();
        console.log('test');
      }
      if (currentStepTitle === 'Excludelist Configuration') {
        if (param === 'save') {
          commitExclusionSettings();
        }
      }
      WizardHandler.wizard('configureIndicatorExtraction').next();
    }


    function moveBack() {
      WizardHandler.wizard('configureIndicatorExtraction').previous();
    }


    function commitExclusionSettings() {
      Object.keys($scope.updatedExclusionSettings.recordValue).forEach(function (item) {
        $scope.defaultGlobalSettings[item] = $scope.updatedExclusionSettings.recordValue[item];
      });
      let keyValue = $scope.defaultGlobalSettings;
      let uuid = $scope.updatedExclusionSettings.recordUUID;
      iocExtractionConfigService.updateKeyStoreRecord(keyValue, uuid);
    }


    function init() {
      // To set value to be displayed on "Excludelist Settings" page
      _initExclusionSetting();
      // To handle backward compatibility for widget
      _handleTranslations();
    }

    init();
  }
})();
