'use strict';

module.exports.formatPrompt = function() {
  return function(input) {
    return input;
  };
};

/*@ngInject*/
module.exports.trustedHtml = function($sce) {
  return function(input) {
    return $sce.trustAsHtml(input);
  };
};
