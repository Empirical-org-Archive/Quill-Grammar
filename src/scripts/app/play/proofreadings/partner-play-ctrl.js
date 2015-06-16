'use strict';

module.exports =

/*@ngInject*/
function PartnerPlayCtrl (
  $scope, localStorageService, _, $state,
  $analytics
) {
  //Add in some custom images for the 3 stories we are showcasing
  $scope.pfImages = require('./pfImages');

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
