'use strict';

module.exports =
angular.module('quill-grammar.services.lms.error-reports', [
  'firebase',
  require('../../../../.tmp/config').name
])
/*@ngInject*/
// Save/retrieve concept tag results from firebase
.service('ErrorReport', function ErrorReport ($firebaseArray, firebaseUrl) {
  var errorReport = this;
  errorReport.ref = new Firebase(firebaseUrl + '/concepts/');

  // Load the list of error reports from firebase, return a promise that receives
  // the loaded list.
  function getErrorList() {
    var errorListRef = new Firebase(firebaseUrl + '/errorReports/');
    var resultList = $firebaseArray(errorListRef);
    return resultList.$loaded();
  }

  // Get the concept error count and return the ref so that
  // it can be incremented.
  function getConceptErrorCount(conceptUid) {
    return errorReport.ref.child(conceptUid + '/errorCount');
  }

  // All concept tag results should be stored in firebase as
  // arrays that are keyed off the activity session ID.
  //
  // Example usage:
  // ConceptResult.save(User.currentUser.sid, {
  //   foo: 'bar'
  // }).then(function() {
  //   console.log('successfully saved');
  // });
  //
  // TODO: Don't store the same result multiple times.
  errorReport.saveToFirebase = function (questionUid, conceptUid, message, sessionId) {
    getErrorList(questionUid, conceptUid).then(function (list) {
      return list.$add({
        questionUid: questionUid,
        conceptUid: conceptUid,
        message: message,
        sessionId: (sessionId ? sessionId : null)
      });
    });

    getConceptErrorCount(conceptUid).transaction(function (currentCount) {
      // If /concepts/UID/errorCount has never been set, errorCount will be null.
      return currentCount + 1;
    });
  };
});
