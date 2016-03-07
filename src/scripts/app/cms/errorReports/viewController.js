'use strict';

module.exports =

/*@ngInject*/
function ConceptsCmsCtrl (
  $scope, $state, _, firebaseUrl, $firebaseArray, $firebaseObject
) {
  var self = this;
  var ref = new Firebase(firebaseUrl + '/errorReports/' + $state.params.id);
  function conceptQuestions() {
    return $firebaseObject(ref);
  }
  $scope.errorReport = conceptQuestions()
  $scope.errorReport.$loaded().then(function(){
    var conceptRef = new Firebase(firebaseUrl + '/concepts/' + $scope.errorReport["conceptUid"]);
    $scope.concept = $firebaseObject(conceptRef);
    $scope.concept.$loaded().then(function () {
      $scope.question = $scope.concept["questions"][$scope.errorReport["questionUid"]]
    })
  })

  var conceptRef = new Firebase(firebaseUrl + '/concepts/' + $scope.errorReport["conceptUid"]);
  $scope.concept = $firebaseObject(conceptRef);

  $scope.destroy = function () {
    console.log("destroying")
    $scope.errorReport.$remove()
    $state.go('cms-error-reports')
  }
};
