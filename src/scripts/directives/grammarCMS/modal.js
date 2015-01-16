function modal() {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      action: '='
    },
    replace: true,
    transclude: true,
    templateUrl: 'modal.html',
    controller: 'ModalDialogCtrl',
    link: function(scope, element, attrs) {
      scope.hideModal = function() {
        scope.show = false;
      };
      scope.doAction = function() {
        scope.action.apply(this, arguments).then(function() {
          scope.hideModal();
        });
      };
    }
  };
}

module.exports.modal = modal;

function deleteModal() {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      onDelete: '=',
      item: '='
    },
    replace: true,
    transclude: true,
    templateUrl: 'deleteModal.html',
    link: function(scope, element, attrs) {
      scope.hideModal = function() {
        scope.show = false;
      };
      scope._onDelete = function() {
        scope.onDelete(scope.item).then(function() {
          scope.hideModal();
        }, function(error) {
          scope.error = error;
        });
      };
    }
  };
}

module.exports.deleteModal = deleteModal;


function controller($scope) {

}

module.exports.controller = ['$scope', controller];
