'use strict';

/* globals confirm */
/* globals alert */
module.exports =

/*@ngInject*/
function ProofreaderActivitiesEditCmsCtrl (
  $scope, ProofreaderActivity, $state, _, ConceptsFBService
) {
  $scope.proofreaderActivity = {};
  $scope.proofreaderActivity.concepts = [];

  ProofreaderActivity.getOneByIdFromFB($state.params.id).then(function (ga) {
    $scope.proofreaderActivity = ga;
    $scope.proofreaderActivity.concepts = _.map($scope.proofreaderActivity.concepts, function (c, k) {
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

  $scope.processProofreaderActivityForm = function () {
    var ga = $scope.proofreaderActivity;
    var id = $state.params.id;
    var updatedProofreaderActivity = {
      title: ga.title,
      description: ga.description,
      concepts: buildConcepts(ga.concepts),
      standard: ga.standard,
      standard_level: ga.standard_level,
      topicCategory: ga.topicCategory
    };

    ProofreaderActivity.updateToFB(id, updatedProofreaderActivity).then(function () {
      $state.go('cms-proofreader-activities');
    }, function (err) {
      alert(err);
    });
  };

  $scope.confirmDelete = function (id) {
    var d = confirm('Are you absolutely sure you want to delete activity: ' + id + '?');
    if (d) {
      ProofreaderActivity.deleteByIdFromFB(id).then(function () {
        $state.go('cms-proofreader-activities');
      }, function (err) {
        throw err;
      });
    }
  };
};
