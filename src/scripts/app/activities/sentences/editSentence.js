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
      var tempList = _.chain(s.rules)
        .pluck('ruleId')
        .toArray()
        .map(function(s) {
          return String(s);
        })
        .value();
      s.rules = _.filter($scope.availableRules, function(r) {
        return _.contains(tempList, String(r.$id));
      });
      s.flag = _.findWhere($scope.flags, function(f) {
        return f.$id == s.flagId;
      });
      $scope.editSentence = s;
    });
};
