/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */


'use strict';

(function () {
  angular
    .module('cybersponse')
    .factory('soarConfigService', soarConfigService);

  soarConfigService.$inject = ['$http', '$q', 'API', '$resource', 'toaster', '$rootScope', 'playbookService', 'websocketService'];

  function soarConfigService($http, $q, API, $resource, toaster, $rootScope, playbookService, websocketService) {

    var service = {
      constants: constants,
      getKeyStoreRecord: getKeyStoreRecord,
      executePlaybook: executePlaybook,
      updateKeyStoreRecord: updateKeyStoreRecord
    }
    return service;

    function constants() {
      return {
        queryForKeyStore: {
          "sort": [],
          "limit": 30,
          "logic": "AND",
          "filters": [
            {
              "type": "array",
              "field": "recordTags",
              "value": [
                "/api/3/tags/excludeListIndicators"
              ],
              "module": "recordTags",
              "display": null,
              "operator": "in",
              "template": "tags",
              "enableJinja": true,
              "OPERATOR_KEY": "$",
              "useInOperator": true,
              "previousOperator": "in",
              "previousTemplate": "tags"
            }
          ],
          "__selectFields": [
            "key",
            "jSONValue"
          ]
        }
      }
    }

    function getKeyStoreRecord(queryObject, module) {
      var defer = $q.defer();
      var url = API.QUERY + module;
      $resource(url).save(queryObject, function (response) {
        defer.resolve(response);
      }, function (err) {
        defer.reject(err);
      })
      return defer.promise;
    }

    function updateKeyStoreRecord(keyStoreValue, recordUUID) {
      $resource(API.API_3_BASE + 'keys' + '/' + recordUUID, null, {
        'update': {
          method: 'PUT'
        }
      }).update({ 'jSONValue': keyStoreValue}).$promise.then(function () {
      });
  }

    function poll(_reqConfig, callback) {
      return $interval(function () {
        if (_reqConfig.hasValueReturned) { //check flag before start new call
          callback(_reqConfig);
        }
        _reqConfig.thresholdValue = _reqConfig.thresholdValue - 1; //Decrease threshold value
        if (_reqConfig.thresholdValue === 0) {
          stopPoll(_reqConfig); // Stop $interval if it reaches to threshold
        }
      }, _reqConfig.pollInterval);
    }
    function stopPoll(_reqConfig) {
      $interval.cancel(_reqConfig.pollPromise);
      _reqConfig.pollPromise = undefined;
      _reqConfig.thresholdValue = 0; //reset all flags.
      _reqConfig.hasValueReturned = true;
    }


    function checkPlaybookExecutionCompletionByPolling(params) {
      var _pollConfig = {
        hasValueReturned: true,
        thresholdValue: 150,
        pollInterval: params.pollInterval || 2000,
        pollPromise: undefined,
        defer: undefined
      };
      _pollConfig.defer = $q.defer();
      _pollConfig.pollPromise = poll(_pollConfig, function (callbackParam) {
        callbackParam.hasValueReturned = false;
        $resource(API.WORKFLOW + 'api/workflows/log_list/?format=json&parent__isnull=True&task_id=' + params.taskId).save({},
          function (data) {
            _pollConfig.hasValueReturned = true;
            if (data['hydra:member'] && data['hydra:member'].length > 0 && (data['hydra:member'][0].status === 'finished' || data['hydra:member'][0].status === 'failed' || data['hydra:member'][0].status === 'terminated')) {
              stopPoll(callbackParam);
              _pollConfig.defer.resolve(data['hydra:member'][0]);
            }
          },
          function (error) {
            statusCodeService(error, true);
            if (params.callback) {
              params.callback(error);
            }
            stopPoll(callbackParam);
            _pollConfig.defer.reject(error);
          });
      });
      if (params.keepPollConfig) {
        playbookPollConfig.push(_pollConfig);
      }
      return _pollConfig.defer.promise;
    }

    function executePlaybook() {
      var defer = $q.defer();
      var queryUrl = API.MANUAL_TRIGGER + '377e76e8-9b5c-48ca-8a96-de5d3ff33c42';
      $http.post(queryUrl, {}).then(function (result) {
        if (result && result.data && result.data.task_id) {
          checkPlaybookExecutionCompletionByPolling({ taskId: [result.data.task_id] }, function (response) {
            if (response && (response.status === 'finished' || response.status === 'failed' || response.status === 'terminated')) {
              playbookService.getExecutedPlaybookLogData(response.instance_ids).then(function (res) {
                defer.resolve(res);
              }, function (err) {
                defer.reject(err);
              });
            }
          }, function (error) {
            defer.reject(error);
          });
        }
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    }
  }
})();