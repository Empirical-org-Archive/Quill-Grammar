'use strict';

module.exports =

/*@ngInject*/
function ConceptsCmsCtrl (
  $scope, _, firebaseUrl, $firebaseArray, $firebaseObject
) {
  var self = this;

  var ref = new Firebase(firebaseUrl + '/errorReports');

  function conceptQuestions() {
    return $firebaseArray(ref);
  }

  $scope.list = conceptQuestions()
};
