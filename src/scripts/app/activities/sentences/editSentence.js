'use strict';

module.exports =

/*@ngInject*/
function EditSentence (
  $scope, SentenceWritingService, $state, _, FlagService
) {
  var flagPromise = FlagService.getFlags();
  SentenceWritingService.getSentenceWriting($state.params.id)
    .then(function (s) {
      s.oldCategoryId = _.clone(s.categoryId);
      s.category = _.first(_.filter($scope.availableCategories, function (o) {
        return o.$id === s.categoryId;
      }));
      var tempList = _.chain(s.rules)
        .pluck('ruleId')
        .toArray()
        .map(function (s) {
          return String(s);
        })
        .value();
      s.rules = _.chain($scope.availableRules)
        .filter(function (r) {
          return _.contains(tempList, String(r.$id));
        })
        .map(function (r) {
          r.quantity = _.findWhere(s.rules, {ruleId: r.$id}).quantity;
          return r;
        })
        .value();
      flagPromise.then(function (flags) {
        $scope.flags = flags;
        s.flag = _.first(_.filter($scope.flags, function (f) {
          return f.$id === s.flagId;
        }));
      });

      $scope.editSentence = s;
    });
};
