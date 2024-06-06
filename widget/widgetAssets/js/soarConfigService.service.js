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

    var GBL_VAR_ENDPOINT = '/api/wf/api/dynamic-variable/?name=';
    var service = {
      constants: constants,
      getGBLVariable: getGBLVariable,
      createOrUpdateKeyStore: createOrUpdateKeyStore,
      removeGBLVariable: removeGBLVariable,
      getKeyStoreRecord: getKeyStoreRecord,
      updateKeyStoreRecord: updateKeyStoreRecord
    }
    return service;

    function constants() {
      return {
        getKeyStoreAllPayload: {
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
        },
        createKeyStorePayload: {
          "key": "",
          "__replace": true,
          "jSONValue": [],
          "__fieldsToUpdate": [
            "jSONValue"
          ]
        },
        findKeyStorePayload:{
          "sort": [
            {
              "field": "id",
              "direction": "ASC",
              "_fieldName": "id"
            }
          ],
          "limit": 30,
          "logic": "AND",
          "filters": [
            {
              "field": "key",
              "operator": "like",
              "_operator": "like",
              "value": "",
              "type": "primitive"
            }
          ],
          "__selectFields": [
            "key",
            "jSONValue"
          ]
      }
      }
    }

    function getGBLVariable(gblVarName) {
      var defer = $q.defer();
      var url = GBL_VAR_ENDPOINT + gblVarName;
      $resource(url).get(null, function (response) {
        defer.resolve(response);
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    }

    function createOrUpdateKeyStore(queryObject, module) {
      var defer = $q.defer();
      var url = '/api/3/upsert/' + module;
      $resource(url).save(queryObject, function (response) {
        defer.resolve(response);
      }, function (err) {
        defer.reject(err);
      })
      return defer.promise;
    }

    function removeGBLVariable(varName) {
      var defer = $q.defer();
      var url = '/api/wf/api/dynamic-variable/?name=' + varName;
      $resource(url).get(null, function (response) {
        defer.resolve(response);
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
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
      }).update({ 'jSONValue': keyStoreValue }).$promise.then(function () {
      });
    }

  }
})();