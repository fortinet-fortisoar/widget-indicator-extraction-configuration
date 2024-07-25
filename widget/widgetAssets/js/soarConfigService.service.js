/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */

'use strict';

(function () {
  angular
    .module('cybersponse')
    .factory('soarConfigService', soarConfigService);

  soarConfigService.$inject = ['$q', 'API', '$resource', 'toaster', '$http'];

  function soarConfigService($q, API, $resource, toaster, $http) {

    var service = {
      constants: constants,
      getGBLVariable: getGBLVariable,
      createOrUpdateKeyStore: createOrUpdateKeyStore,
      deleteGBLVariable: deleteGBLVariable,
      getKeyStoreRecord: getKeyStoreRecord,
      updateKeyStoreRecord: updateKeyStoreRecord,
      getGblVarToKeyStoreMapping: getGblVarToKeyStoreMapping
    }
    return service;

    function constants() {
      return {
        createKeyStorePayload: {
          "key": "",
          "notes": "",
          "__replace": true,
          "jSONValue": [],
          "recordTags": [
            API.API_3_BASE + 'tags/ExcludeListIOCs'
          ],
          "__fieldsToUpdate": [
            "jSONValue"
          ]
        },
        findKeyStorePayload: {
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

    function getGblVarToKeyStoreMapping(widgetBasePath) {
      var defer = $q.defer();
      var url = widgetBasePath + 'widgetAssets/gblVarToKeyStoreMapping.json'
      $http.get(url).then(function (response) {
        defer.resolve(response.data);
      }).catch(function (err) {
        defer.reject(err);
      });
      return defer.promise;
    }

    function getGBLVariable(gblVarName) {
      var defer = $q.defer();
      var url = API.WORKFLOW + API.API + '/dynamic-variable/?name=' + gblVarName;
      $resource(url).get(null, function (response) {
        defer.resolve(response);
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    }

    function createOrUpdateKeyStore(queryObject, module) {
      var defer = $q.defer();
      var url = API.API_3_BASE + 'upsert/' + module;
      $resource(url).save(queryObject, function (response) {
        defer.resolve(response);
      }, function (err) {
        defer.reject(err);
      })
      return defer.promise;
    }

    function deleteGBLVariable(varName) {
      var defer = $q.defer();
      var url = API.WORKFLOW + API.API + '/dynamic-variable/' + varName + '/?format=json';
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
      }).update({ 'jSONValue': keyStoreValue }).$promise.then(function (response) {
        return response;
      }).catch(function (err) {
        toaster.error({
          body: 'Global Setting Configuration Failed.'
        });
        return $q.reject(err);
      });
    }
  }
})();