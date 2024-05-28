/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */


  'use strict';

  (function () {
      angular
          .module('cybersponse')
          .factory('soarConfigService', soarConfigService);
  
          soarConfigService.$inject = ['$http', '$q', 'API', '$resource', 'toaster'];
  
      function soarConfigService($http, $q, API, $resource, toaster) {
  
          var service = {
              constants: constants,
              getKeyStoreRecord: getKeyStoreRecord
          }
          return service;
          
          function constants() {
              return {
                  queryForKeyStore:{
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
                          "value": "%Excludelist_IPs%",
                          "type": "primitive"
                        },
                        {
                          "sort": [],
                          "limit": 30,
                          "logic": "AND",
                          "filters": []
                        }
                      ],
                      "__selectFields": [
                        "id",
                        "key",
                        "value",
                        "notes",
                        "@id",
                        "@type",
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
      }
  })();