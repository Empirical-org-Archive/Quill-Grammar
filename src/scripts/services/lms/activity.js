'use strict';

module.exports =
angular.module('quill-grammar.services.lms.activity', [
  'underscore',
  require('../../../../.tmp/config').name,
])
/*@ngInject*/
.factory('Activity', function ActivitySession (_, $http, empiricalBaseURL) {
  var url = empiricalBaseURL + '/activities';

  // Constructor
  function Activity(data) {
    this.data = {};

    if (data) {
      _.extend(this.data, data);
    }
    return this;
  }

  // instance methods

  Activity.prototype.create = function () {
    return $http.post(url, this.data);
  };

  function missingRequiredKeys(data) {
    var requiredKeys = [
      'name',
      'description',
      'uid',
      'topic_uid',
      'activity_classification_uid'
    ];

    var actualKeys = _.keys(data);
    var missingKeys = _.difference(requiredKeys, actualKeys);
    if (missingKeys.length) {
      return missingKeys;
    }

    return false;
  }

  Activity.prototype.isValid = function () {
    var missingKeys = missingRequiredKeys(this.data);
    if (missingKeys) {
      this.errorMessages = 'Activity cannot be submitted without required keys';
      return false;
    }

    return true;
  };

  return Activity;
});
