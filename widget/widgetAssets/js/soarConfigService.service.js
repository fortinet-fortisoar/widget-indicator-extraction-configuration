/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */


'use strict';

(function () {
  angular
    .module('cybersponse')
    .factory('soarConfigService', soarConfigService);

  soarConfigService.$inject = ['$q', 'API', '$resource'];

  function soarConfigService($q, API, $resource) {

    var GBL_VAR_ENDPOINT = '/api/wf/api/dynamic-variable/';
    var API_UPSERT = '/api/3/upsert/'
    var service = {
      constants: constants,
      getGBLVariable: getGBLVariable,
      createOrUpdateKeyStore: createOrUpdateKeyStore,
      deleteGBLVariable: deleteGBLVariable,
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
          "recordTags": [
            "/api/3/tags/excludeListIndicators"
          ],
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
      var url = GBL_VAR_ENDPOINT + '?name=' + gblVarName;
      $resource(url).get(null, function (response) {
        defer.resolve(response);
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    }

    function createOrUpdateKeyStore(queryObject, module) {
      var defer = $q.defer();
      var url = API_UPSERT + module;
      $resource(url).save(queryObject, function (response) {
        defer.resolve(response);
      }, function (err) {
        defer.reject(err);
      })
      return defer.promise;
    }

    function deleteGBLVariable(varName) {
      var defer = $q.defer();
      var url = GBL_VAR_ENDPOINT + varName + '/?format=json';
      $resource(url, null, {
        'delete': { method: 'DELETE' }
      }).delete(null, function (response) {
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