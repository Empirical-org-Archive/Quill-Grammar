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
.factory('ProofreaderActivity', function (firebaseUrl, $firebaseObject, _, $q, $firebaseArray) {
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

  /*
   * Get all Proofreader Activities from Firebase
   */
  ProofreaderModel.getAllFromFB = function () {
    return $firebaseArray(ProofreaderModel.ref).$loaded();
  };

  /*
   * Add one Proofreader Activity to Firebase
   */
  ProofreaderModel.addToFB = function (pa) {
    return $firebaseArray(ProofreaderModel.ref).$add(pa);
  };

  /*
   * Update one Proofreader Activity to Firebase
   */
  ProofreaderModel.updateToFB = function (id, pa) {
    return $firebaseObject(ProofreaderModel.ref).$loaded().then(function (pas) {
      pas[id] = pa;
      return pas.$save();
    });
  };

  /*
   * Delete one Proofreader Activity from Firebase
   */
  ProofreaderModel.deleteByIdFromFB = function (id) {
    return $firebaseObject(ProofreaderModel.ref).$loaded().then(function (pas) {
      pas[id] = null;
      return pas.$save();
    });
  };

  return ProofreaderModel;
});
