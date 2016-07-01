'use strict';

module.exports =
angular.module('quill-grammar.services.lms.concept-result', [
  'firebase',
  require('../../../../.tmp/config').name
])
/*@ngInject*/
// Save/retrieve concept tag results from firebase
.service('ConceptResult', function ConceptResult ($firebaseArray, firebaseUrl, $q) {
  var conceptResult = this;
  conceptResult.ref = new Firebase(firebaseUrl + '/concept_results');

  // Load the list of results from firebase, return a promise that receives
  // the loaded list.
  function getResultList(activitySessionId) {
    var resultList = $firebaseArray(conceptResult.ref.child(activitySessionId));
    return resultList.$loaded();
  }

  conceptResult.getResultList = getResultList;

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
  conceptResult.saveToFirebase = function (activitySessionId, conceptUid, activityClassificationId, metadata) {
    return getResultList(activitySessionId).then(function (list) {
      return list.$add({
        concept_uid: conceptUid,
        activity_classification_id: activityClassificationId,
        metadata: metadata
      });
    });
  };

  // Retrieve all concept tag results in a plain JSON form that can be used
  // to post back to the LMS. Returns a promise that receives the JSON object.
  //
  // Example usage:
  //
  // ConceptResult.findAsJsonByActivitySessionId(User.currentUser.sid).then(function(json) {
  //  console.log('here is the prepared json', json);
  // });
  conceptResult.findAsJsonByActivitySessionId = function (activitySessionId) {
    return getResultList(activitySessionId).then(function (list) {
      // Need to strip out $id and $priority fields from the JSON, because we do not want the LMS
      // to store that data.
      return list.map(function (fbResultObject) {
        var clean = JSON.parse(JSON.stringify(fbResultObject));
        delete clean.$id;
        delete clean.$priority;
        return clean;
      });
    });
  };

  // Remove concept tags by session id
  // Users of this service should call this once they have successfully submitted concept results
  // to the LMS.
  conceptResult.removeBySessionId = function (activitySessionId) {
    var resultsSessionRef = conceptResult.ref.child(activitySessionId);
    return $q(function (resolve, reject) {
      resultsSessionRef.remove(function (err) {
        if (err) {
          reject('Failed to remove ref!');
        } else {
          resolve('Success!');
        }
      });
    });
  };
});
