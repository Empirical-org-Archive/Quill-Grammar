/*global Porthole*/
'use strict';

/*@ngInject*/
module.exports = function ($scope, $state, empiricalBaseURL) {
  if ($state.params.student) {
    var uid = $state.params.student;
    $state.returnUrl = empiricalBaseURL.split('api')[0] + "activity_sessions/" + uid
  } else {
    $state.returnUrl = empiricalBaseURL.split('api')[0]
  }

  window.location.href = $state.returnUrl
};
