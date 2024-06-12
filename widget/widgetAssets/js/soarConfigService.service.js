/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */


'use strict';

(function () {
  angular
    .module('cybersponse')
    .factory('soarConfigService', soarConfigService);

  soarConfigService.$inject = ['$q', 'API', '$resource', 'toaster'];

  function soarConfigService($q, API, $resource, toaster) {

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
        gblVarToKeyStoreMapping: {
          "Excludelist_IPs": {
            "keystore": "sfsp-excludelist-ips",
            "defaultValue": "8.8.8.8,10.1.1.2"
          },
          "Excludelist_URLs": {
            "keystore": "sfsp-excludelist-urls",
            "defaultValue": "https://www.google.com,https://mail.yahoo.com/login.html,https://www.office.com/"
          },
          "Excludelist_Domains": {
            "keystore": "sfsp-excludelist-domains",
            "defaultValue": "google.com,yahoo.com,fortinet.net,gmail.com,outlook.com,microsoft.com,fortinet.com,twitter.com,facebook.com,linkedin.com,instagram.com,fortiguard.com,forticloud.com,w3.org"
          },
          "Excludelist_Files": {
            "keystore": "sfsp-excludelist-files",
            "defaultValue": ""
          },
          "Excludelist_Ports": {
            "keystore": "sfsp-excludelist-ports",
            "defaultValue": ""
          },
          "CIDR_Range": {
            "keystore": "sfsp-cidr-range",
            "defaultValue": "10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
          }
        },
        createKeyStorePayload: {
          "key": "",
          "__replace": true,
          "jSONValue": [],
          "recordTags": [
            API.API_3_BASE + 'tags/excludeListIndicators'
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
      $resource(API.API_3_BASE + 'keys' + '/' + null, null, {
        'update': {
          method: 'PUT'
        }
      }).update({ 'jSONValue': keyStoreValue }).$promise.then(function (response) {
        return response;
      }).catch(function(err){
        toaster.error({
          body: 'Global Setting Configuration Failed.'
        });
        return $q.reject(err);
      });
    }
  }
})();