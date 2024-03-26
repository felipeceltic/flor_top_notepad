(function () {
  'use strict';

  angularjs.controller('angularjs', ['$scope', 'zendeskService', function ($scope, zendeskService) {

    client.get('currentUser').then(function (data) {
      var currentUserID = data.currentUser.id;
      client.metadata().then(function (data) {
        var ObjectID = data.settings.NotepadObjetctKey;
        var lookupFieldID = data.settings.NotepadObjetctLookup;
        fetchNoteRecord(currentUserID, ObjectID, lookupFieldID);
      })
    })

    function fetchNoteRecord(currentUserID, ObjectID, lookupFieldID) {

      zendeskService.getNoteRecord(currentUserID, ObjectID, lookupFieldID).then(function (record) {

        var element = record.custom_object_records[0];

        if (element != undefined && element.custom_object_fields.agent_id === currentUserID.toString()) {

          document.getElementById('note').value = element.custom_object_fields.textarea;

          document.getElementById('insertNote').addEventListener('submit', function (event) {
            event.preventDefault()

            var note = document.getElementById('note').value;

            zendeskService.updateNoteRecord(note, element.id, currentUserID).then(function (data) {
              $scope.saved = 'Nota salva com sucesso';
              $('#avisoModal').modal('show');
            }).catch(function (error) {
              $scope.saved = error.responseText;
              $('#avisoModal').modal('show');
            })
          });
        } else {

          document.getElementById('insertNote').addEventListener('submit', function (event) {
            event.preventDefault()
  
            var note = document.getElementById('note').value;
  
            zendeskService.createNoteRecord(note, currentUserID).then(function (data) {
              $scope.saved = 'Nota salva com sucesso';
              $('#avisoModal').modal('show');
            }).catch(function (error) {
              $scope.saved = error.responseText;
              $('#avisoModal').modal('show');
            })

          });
        }
      })
      $('#avisoModal').on('hidden.bs.modal', function (e) {
        location.reload();
      });
    }


  }]);

})();