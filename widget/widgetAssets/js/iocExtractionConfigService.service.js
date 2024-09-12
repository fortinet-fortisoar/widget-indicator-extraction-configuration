/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */


'use strict';

(function () {
  angular
    .module('cybersponse')
    .factory('iocExtractionConfigService', iocExtractionConfigService);

  iocExtractionConfigService.$inject = ['$q', 'API', '$resource', 'toaster', 'connectorService'];

  function iocExtractionConfigService($q, API, $resource, toaster, connectorService) {

    var service = {
      constants: constants,
      getGlobalVariable: getGlobalVariable,
      createOrUpdateKeyStore: createOrUpdateKeyStore,
      deleteGlobalVariable: deleteGlobalVariable,
      getKeyStoreRecord: getKeyStoreRecord,
      updateKeyStoreRecord: updateKeyStoreRecord,
      executeAction: executeAction,
      getIndicatorRegex: getIndicatorRegex
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
        },
        globalVariablesToKeyStoreMapping: {
          "sfsp-excludelist-ips": ["Excludelist_IPs", "IP Address", true],
          "sfsp-excludelist-urls": ["Excludelist_URLs", "URL", true],
          "sfsp-excludelist-domains": ["Excludelist_Domains", "Domain", true],
          "sfsp-excludelist-ports": ["Excludelist_Ports", "Port", true],
          "sfsp-excludelist-files": ["Excludelist_Files", "File", true],
          "sfsp-excludelist-cidr-ranges": ["NA", "CIDR Range", true],
          "sfsp-excludelist-file-hashes":["NA", "File Hash", true],
          "sfsp-indicator-type-mapping": ["Indicator_Type_Map", "NA", true]
        }
      }
    }


    function getIndicatorRegex() {
      return executeAction('cyops_utilities', 'get_regx_of_indicators', null, []);
    }


    function executeAction(connector_name, connector_action, userLoginId, payload) {
      return $resource(API.INTEGRATIONS + 'connectors/?name=' + connector_name)
        .get()
        .$promise
        .then(function (connectorMetaDataForVersion) {
          return connectorService.executeConnectorAction(connector_name, connectorMetaDataForVersion.data[0].version, connector_action, userLoginId, payload);
        })
        .catch(function (error) {
          console.error('Error:', error);
          throw error; // Rethrow the error to be handled by the caller
        });
    }


    function getGlobalVariable(gblVarName) {
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

    function deleteGlobalVariable(gblVarName) {
      var defer = $q.defer();
      var url = API.WORKFLOW + API.API + '/dynamic-variable/' + gblVarName + '/?format=json';
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