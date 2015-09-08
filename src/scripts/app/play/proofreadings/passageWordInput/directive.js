'use strict';

module.exports =
/*@ngInject*/
function ($rootScope) {
  return {
    restrict: 'E',
    templateUrl: 'passage-word-input.html',
    link: function (scope, element) {
      var word = scope.word;
      var $input = element.find('input');
      // Initialize input value.
      $input.val(word.responseText);

      function hideBreakTags() {
        if (word.isBr()) {
          element.css('display', 'none');
        } else {
          element.css('display', 'inline');
        }
      }

      hideBreakTags();

      // Replace ng-focus
      element.on('focus', function () {
        this.addClass('focus');
      });

      // Replace ng-blur
      element.on('blur', function () {
        this.removeClass('focus');
      });

      element.on('input', function () {
        // Replace ng-model
        var newValue = $input.val();
        word.responseText = newValue;
        // Replace ng-change
        scope.proofreadingPassage.onInputChange(word);
        $rootScope.$apply();

        // Replace ng-show
        hideBreakTags();
      });
    }
  };
};
