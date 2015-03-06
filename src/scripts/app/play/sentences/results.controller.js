/*global Porthole*/
'use strict';

/*@ngInject*/
module.exports = function($state) {
  var windowProxy = new Porthole.WindowProxy();
  var postObj = {
    action: 'activity_complete',
  };

  if ($state.params.student) {
    postObj.id = $state.params.student;
  }

  windowProxy.post(postObj);


};
