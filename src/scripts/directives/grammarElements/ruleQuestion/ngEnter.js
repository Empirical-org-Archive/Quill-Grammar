'use strict';
module.exports = function () {
  return function (scope, element, attrs) {
    element.bind('keypress', function (event) {
      if (element['0'].textLength === 0) {
        scope.$eval(attrs.ngTimer);
      }
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
};
