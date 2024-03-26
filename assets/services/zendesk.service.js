(function () {
  'use strict';

  angularjs.service('zendeskService', ["$q", function ($q) {

    var client = ZAFClient.init();

    return {

      createNoteRecord: function (note, userID) {

        var deferred = $q.defer();
        var ObjectID = 'bloco_de_notas';

        var data = JSON.stringify({
          "custom_object_record": {
            "custom_object_fields": {
              "textarea": note,
              "agent_id": userID
            },
            "name": userID.toString()
          }
        });

        client.request({
          url: '/api/v2/custom_objects/' + ObjectID + '/records',
          type: 'POST',
          data: data,
          contentType: 'application/json'
        }).then(function (response) {
          deferred.resolve(response);
        }).catch(function (error) {
          deferred.reject(error)
        });
        return deferred.promise;
      },

      getNoteRecord: function (userID, ObjectID, lookupFieldID) {
        var deferred = $q.defer();
        
        client.request({
          url: '/api/v2/zen:user/' + userID + '/relationship_fields/' + lookupFieldID + '/zen:custom_object:' + ObjectID,
          type: 'GET',
          contentType: 'application/json',
        }).then(function (response) {
          deferred.resolve(response);
        }).catch(function (error) {
          deferred.reject(error)
        })

        return deferred.promise;
      },

      updateNoteRecord: function (note, ObjectRecordID, currentUserID) {

        var deferred = $q.defer();
        var ObjectID = 'bloco_de_notas';

        var data = JSON.stringify({
          "custom_object_record": {
            "custom_object_fields": {
              "textarea": note,
              "agent_id": currentUserID
            },
          }
        });

        client.request({
          url: '/api/v2/custom_objects/' + ObjectID + '/records/' + ObjectRecordID,
          type: 'PATCH',
          data: data,
          contentType: 'application/json'
        }).then(function (response) {
          deferred.resolve(response);
        }).catch(function (error) {
          deferred.reject(error)
        });
        return deferred.promise;
      },

    }

  }])

})();