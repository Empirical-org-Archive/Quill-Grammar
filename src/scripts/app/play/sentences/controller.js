'use strict';
module.exports =

/*@ngInject*/
function SentencePlayCtrl(
  $scope, $state, SentenceWritingService, RuleService
) {
  $scope.id = $state.params.id;

  SentenceWritingService.getSentenceWriting($scope.id).then(function(sw) {
    console.log(sw);
  }, function() {
    $state.go('index');
  });
};
