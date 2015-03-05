'use strict';

/*@ngInject*/
module.exports = function($state) {
  if ($state.params.student) {
    if (window && window.quill && window.quill.iframe) {
      window.quill.iframe.activityFinished({id: $state.params.student});
    }
  }
};
