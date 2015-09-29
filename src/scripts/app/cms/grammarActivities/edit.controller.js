'use strict';

/* globals confirm */
/* globals alert */
module.exports =

/*@ngInject*/
function GrammarActivitiesEditCmsCtrl (
  $scope, GrammarActivity, $state, _, ConceptsFBService
) {
  $scope.grammarActivity = {};
  $scope.grammarActivity.concepts = [];

  GrammarActivity.getOneByIdFromFB($state.params.id).then(function (ga) {
    $scope.grammarActivity = ga;
    $scope.grammarActivity.concepts = _.map($scope.grammarActivity.concepts, function (c, k) {
      c.$id = k;
      ConceptsFBService.getById(k).then(function (cfb) {
        if (cfb) {
          c.concept_level_2 = cfb.concept_level_2;
          c.concept_level_1 = cfb.concept_level_1;
          c.concept_level_0 = cfb;
        }
      });
      return c;
    });
  });

  function buildConcepts(set) {
    return _.chain(set)
      .map(function (s) {
        if (s.concept_level_0 && s.concept_level_0.$id) {
          return [s.concept_level_0.$id, {
            quantity: Number(s.quantity),
            ruleNumber: s.concept_level_0.ruleNumber
          }];
        } else {
          if (s.$id && _.isNumber(s.quantity) && _.isNumber(s.ruleNumber)) {
            return [s.$id, {
              quantity: Number(s.quantity),
              ruleNumber: Number(s.ruleNumber)
            }];
          } else {
            return [s.$id, {}];
          }
        }
      })
      .object()
      .value();
  }

  $scope.processGrammarActivityForm = function () {
    var ga = $scope.grammarActivity;
    var id = $state.params.id;
    var updatedGrammarActivity = {
      title: ga.title,
      description: ga.description,
      concepts: buildConcepts(ga.concepts),
      standard: ga.standard,
      standard_level: ga.standard_level,
      topicCategory: ga.topicCategory
    };

    GrammarActivity.updateToFB(id, updatedGrammarActivity).then(function () {
      $state.go('cms-grammar-activities');
    }, function (err) {
      alert(err);
    });
  };

  $scope.confirmDelete = function (id) {
    var d = confirm('Are you absolutely sure you want to delete activity: ' + id + '?');
    if (d) {
      GrammarActivity.deleteByIdFromFB(id).then(function () {
        $state.go('cms-grammar-activities');
      }, function (err) {
        throw err;
      });
    }
  };
};
