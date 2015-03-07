/*global Porthole*/
'use strict';

/*@ngInject*/
module.exports = function($scope, $state) {
  var windowProxy = new Porthole.WindowProxy('http://staging.quill.org/porthole_proxy');
  var postObj = {
    action: 'activity_complete',
  };

  if ($state.params.student) {
    postObj.id = $state.params.student;
  }

  windowProxy.post(postObj);


};
