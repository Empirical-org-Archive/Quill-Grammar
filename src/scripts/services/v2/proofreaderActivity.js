'use strict';

/* Usage:
 *
 * ProofreaderActivity.get(id).then(function (proofreaderActivity) {
 *  return proofreaderActivity.getRules();
 * }).then(function (rules) {
 *  // do something here
 * });
 *
 */

module.exports =
angular.module('quill-grammar.services.firebase.proofreaderActivity', [
  'firebase',
  'underscore',
  require('./../../../../.tmp/config.js').name,
])
/*@ngInject*/
.factory('ProofreaderActivity', function (firebaseUrl, $firebaseObject, _) {
  function ProofreaderModel(data) {
    if (data) {
      _.extend(this, data);
    }
    return this;
  }
  ProofreaderModel.ref = new Firebase(firebaseUrl + '/v2/passageProofreadings');

  // 'Class' methods

  ProofreaderModel.getById = function (id) {
    return $firebaseObject(ProofreaderModel.ref.child(id)).$loaded().then(function (data) {
      return new ProofreaderModel(data);
    });
  };

  return ProofreaderModel;
});
