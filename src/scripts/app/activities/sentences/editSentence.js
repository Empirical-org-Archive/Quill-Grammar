'use strict';

module.exports =

/*@ngInject*/
function EditSentence(
  $scope, SentenceWritingService, $state, _
) {
  SentenceWritingService.getSentenceWriting($state.params.id)
    .then(function(s) {
      s.category = _.findWhere($scope.availableCategories, function(o) {
        return o.$id == s.categoryId;
      });
      s.rules = _.map(s.rules, function(r) {
        var rr = _.findWhere($scope.availableRules, {$id: r.ruleId});
        rr.quantity = r.quantity;
        return rr;
      });
      $scope.editSentence = s;
    });
};
