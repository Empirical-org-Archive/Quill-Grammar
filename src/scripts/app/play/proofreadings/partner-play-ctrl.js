'use strict';

module.exports =

/*@ngInject*/
function PartnerPlayCtrl (
  $scope, localStorageService, _, $state,
  $analytics
) {
  //Add in some custom images for the 3 stories we are showcasing
  $scope.pfImages = {
    '70B-T6vLMTM9zjQ9LCwoCg': 'the_princes_and_the_turtle_story_header.png',
    'MJCtkml_69W2Dav79v4r9Q': 'ernest_shackleton_story_header.png',
    'Yh49ICvX_YME8ui7cDoFXQ': 'the_apollo_8_photograph_story_header.png'
  };

  $scope.onScoreReset = function () {
    var keys = _.keys($scope.pfImages);
    function remove(key) {
      localStorageService.remove(key);
    }
    _.each(keys, function (key) {
      _.each(['pf-' + key, 'sw-' + key, 'sw-temp-' + key], remove);
    });
    $scope.showResetScoreModal = false;
    $state.go($state.current, {}, {reload: true});
  };

  $scope.$on('$stateChangeStart', function (event, toState, toParams) {
    $analytics.eventTrack('Start Activity', toParams);
  });
};
