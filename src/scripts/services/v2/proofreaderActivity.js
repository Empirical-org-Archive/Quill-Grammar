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
.factory('ProofreaderActivity', function (firebaseUrl, $firebaseObject, _, $q) {
  function ProofreaderModel(data) {
    if (data) {
      _.extend(this, data);
    }
    return this;
  }
  ProofreaderModel.ref = new Firebase(firebaseUrl + '/passageProofreadings');

  // 'Class' methods

  ProofreaderModel.getById = function (id) {
    return $firebaseObject(ProofreaderModel.ref.child(id)).$loaded().then(function (data) {
      // Determine whether the activity exists.
      // This is a hack because $firebaseObject does not give access
      // to the DataSnapshot object where we'd normally call exists().
      if (!data.passage) {
        return $q.reject(new Error('Error loading activity: activity with ID ' + id + ' does not exist.'));
      }

      return new ProofreaderModel(data);
    });
  };

  return ProofreaderModel;
});
