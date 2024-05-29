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
      }
  })();