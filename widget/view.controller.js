/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */
  
'use strict';
(function () {
    angular
      .module('cybersponse')
      .controller('soarFrameworkConfigurationWizard100Ctrl', soarFrameworkConfigurationWizard100Ctrl);

    soarFrameworkConfigurationWizard100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$rootScope', 'widgetBasePath', 'WizardHandler'];

    function soarFrameworkConfigurationWizard100Ctrl($scope, widgetUtilityService, $rootScope, widgetBasePath, WizardHandler) {
      $scope.moveNext = moveNext;
      $scope.isLightTheme = $rootScope.theme.id === 'light';
      $scope.startPageImage = $scope.isLightTheme ? widgetBasePath +'images/sfspStartLight.png': widgetBasePath +'images/sfspStartDark.png';

      function _handleTranslations() {
        widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
          };
        });
      }

      function moveNext() {

        WizardHandler.wizard('soarFrameworkConfigurationWizard').next();
    }

      function init() {
        // To handle backward compatibility for widget
        _handleTranslations();
      }

      init();
    }
})();
