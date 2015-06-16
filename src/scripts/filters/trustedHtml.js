'use strict';
/*@ngInject*/
module.exports = function($sce) {
  return function(input) {
    return $sce.trustAsHtml(input);
  };
};
