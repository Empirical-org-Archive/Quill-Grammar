'use strict';

module.exports =

/*@ngInject*/
function ProofreadingsErrorTooltipCtrl ($scope, _) {
  $scope.getErrorTooltipClass = function (index) {
    var results = $scope.$parent.results;
    var d = {'error-tooltip-reverse': true};
    if (false) {
      var ri = _.indexOf(_.pluck(results, 'index'), index);
      var sp = 3;
      d = {
        'error-tooltip': ri > sp,
        'error-tooltip-reverse': ri <= sp
      };
    }
    return d;
  };

  $scope.getErrorTooltipTopClass = function (type) {
    var obj = {'top-panel': true};
    obj[type] = true;
    return obj;
  };

  $scope.answerImageName = function (t) {
    if (!t) {
      return;
    }
    return _.map(t.split(' '), function (s) {
      return s.toLowerCase();
    }).join('_');
  };
};
