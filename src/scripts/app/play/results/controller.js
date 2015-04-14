'use strict';

module.exports =

/*@ngInject*/
function InternalResultsController(
  $scope, $state, _, localStorageService, $analytics
) {
  $scope.partnerIframe = $state.params.partnerIframe;

  /*
   * This is some extra stuff for the partner integration
   * TODO move this out of here
   */
  //Add in some custom images for the 3 stories we are showcasing
  $scope.pfImages = {
    '70B-T6vLMTM9zjQ9LCwoCg': 'the_princes_and_the_turtle_story_header.png',
    'MJCtkml_69W2Dav79v4r9Q': 'ernest_shackleton_story_header.png',
    'Yh49ICvX_YME8ui7cDoFXQ': 'the_apollo_8_photograph_story_header.png'
  };

  $scope.pfTitles = {
    '70B-T6vLMTM9zjQ9LCwoCg': 'The Princess and the Turtle',
    'MJCtkml_69W2Dav79v4r9Q': 'Ernest Shackleton Escapes the Antarctic',
    'Yh49ICvX_YME8ui7cDoFXQ': 'The Apollo 8 Photograph'
  };

  if ($state.params.passageId) {
    $scope.passageImageUrl = $scope.pfImages[$state.params.passageId];
    $scope.passageTitle = $scope.pfTitles[$state.params.passageId];
    $scope.uid = $state.params.passageId;
  }


  /*
   * TODO replace this with the dynamic version
   * from local storage.
   */
  $scope.swResults = localStorageService.get('sw-' + $state.params.passageId);

  $scope.pfResults = localStorageService.get('pf-' + $state.params.passageId);

  /*
   * Maps a result entry to an array of true and false values.
   * This represents the correct and incorrect images shown
   * for each result.
   */
  $scope.imageList = function(r) {
    var list = _.chain(_.range(0, r.total))
      .map(function(num) {
        return r.correct > num;
      })
      .value();
    return list;
  };

  /*
   * reduces the results into a ratio
   */
  $scope.getErrorsFoundString = function(results) {
    var correct = _.reduce(results, function(correct, r) {
      return correct + r.correct;
    }, 0);

    var total = _.reduce(results, function(total, r) {
      return total + r.total;
    }, 0);

    return '' + correct + '/' + total;

  };

  function getValues() {
    var pf = $scope.getErrorsFoundString($scope.pfResults).split('/');
    var sw = $scope.getErrorsFoundString($scope.swResults).split('/');
    var f = Number(pf[0]) + Number(sw[0]);
    var t = Number(pf[1]) + Number(sw[1]);
    return {
      found: f,
      total: t
    };
  }

  $scope.getTotalErrorsFoundString = function() {
    var v = getValues();
    return '' + v.found + '/' + v.total;
  };

  $scope.$on('$viewContentLoaded', function() {
    var v = getValues();
    v.uid = $scope.uid;
    $analytics.eventTrack('Activity Results Viewed', v);
  });
};
