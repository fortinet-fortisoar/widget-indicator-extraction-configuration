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

    soarFrameworkConfigurationWizard100Ctrl.$inject = ['$scope', 'widgetUtilityService'];

    function soarFrameworkConfigurationWizard100Ctrl($scope, widgetUtilityService) {

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
