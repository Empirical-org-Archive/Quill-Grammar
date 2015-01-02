function modal() {
  return {
    restrict: 'E',
    scope: {
      title: '=',
      onSubmit: '=',
      onCancel: '=',
    },
    templateUrl: 'modal.html',
    controller: 'ModalDialogCtrl'
  };
}

module.exports.modal = modal;


function controller($scope) {

}

module.exports.controller = ['$scope', controller];
