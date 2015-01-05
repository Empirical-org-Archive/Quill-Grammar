function modal() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    transclude: true,
    templateUrl: 'modal.html',
    controller: 'ModalDialogCtrl',
    link: function(scope, element, attrs) {
      scope.hideModal = function() {
        scope.show = false;
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
    controller: 'ModalDialogCtrl',
    link: function(scope, element, attrs) {
      scope.hideModal = function() {
        scope.show = false;
      };
    }
  };
}

module.exports.deleteModal = deleteModal;


function controller($scope) {

}

module.exports.controller = ['$scope', controller];
