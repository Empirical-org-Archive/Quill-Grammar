'use strict';

module.exports =

/*@ngInject*/
function EditSentence(
  $scope, SentenceWritingService, $state
) {
  SentenceWritingService.getSentenceWriting($state.params.id)
    .then(function(s) {
      $scope.editSentence = s;
    });
};
