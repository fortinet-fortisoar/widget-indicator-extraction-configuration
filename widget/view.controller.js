/* Copyright start
  Copyright (C) 2008 - 2024 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
  
'use strict';
(function () {
    angular
      .module('cybersponse')
      .controller('soarFrameworkConfigurationWizard100Ctrl', soarFrameworkConfigurationWizard100Ctrl);

    soarFrameworkConfigurationWizard100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$rootScope', 'widgetBasePath','$controller'];

    function soarFrameworkConfigurationWizard100Ctrl($scope, widgetUtilityService, $rootScope, widgetBasePath, $controller) {
      $scope.isLightTheme = $rootScope.theme.id === 'light';
      $scope.startPageImage = $scope.isLightTheme ? widgetBasePath +'images/sfsp-start-light.png': widgetBasePath +'images/sfsp-start-dark.png';

      function _handleTranslations() {
        widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
          };
        });
      }

      function init() {
        // To handle backward compatibility for widget
        _handleTranslations();
      }

      init();
    }
})();
