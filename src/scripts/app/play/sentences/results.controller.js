/*global Porthole*/
'use strict';

/*@ngInject*/
module.exports = function($scope, $state, portholeProxy) {
  var windowProxy = new Porthole.WindowProxy(portholeProxy);
  var postObj = {
    action: 'activity_complete',
  };

  if ($state.params.student) {
    postObj.id = $state.params.student;
  }

  if ($state.params.partnerIframe) {
    $state.go('play-internal-results', {
      passageId: $state.params.passageId,
      partnerIframe: $state.params.partnerIframe
    });
  } else {
    windowProxy.post(postObj);
  }

};
