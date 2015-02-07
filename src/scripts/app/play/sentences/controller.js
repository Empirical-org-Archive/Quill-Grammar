'use strict';
module.exports =

/*@ngInject*/
function SentencePlayCtrl($scope, $state) {
  $scope.id = $state.params.id;
};
