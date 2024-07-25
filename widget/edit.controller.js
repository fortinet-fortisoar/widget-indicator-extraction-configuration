/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */

'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editConfigureIndicatorExtraction100Ctrl', editConfigureIndicatorExtraction100Ctrl);

  editConfigureIndicatorExtraction100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'widgetUtilityService', '$timeout'];

  function editConfigureIndicatorExtraction100Ctrl($scope, $uibModalInstance, config, widgetUtilityService, $timeout) {
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.config = config;

    function _handleTranslations() {
      let widgetNameVersion = widgetUtilityService.getWidgetNameVersion($scope.$resolve.widget, $scope.$resolve.widgetBasePath);

      if (widgetNameVersion) {
        widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
          };
        });
      } else {
        $timeout(function () {
          $scope.cancel();
        });
      }
    }

    function init() {
      // To handle backward compatibility for widget
      _handleTranslations();
    }

    init();

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function save() {
      $uibModalInstance.close($scope.config);
    }

  }
})();
