'use strict';

/*@ngInject*/
module.exports =
angular.module('quill-grammar.services.sentenceWriting', [
  require('./crud.js').name,
])

.factory('SentenceWritingService', function(CrudService, _) {
  var crud = new CrudService('sentenceWritings', [
    'flagId', 'categoryId', 'rules', 'title', 'description'
  ]);
  this.saveSentenceWriting = function(sentenceWritingActivity) {
    var valid = _.every(['category', 'flag'], function(k) {
      if (sentenceWritingActivity[k] && sentenceWritingActivity[k].$id) {
        sentenceWritingActivity[k + 'Id'] = sentenceWritingActivity[k].$id;
        return true;
      } else {
        return false;
      }
    });
    if (!valid) {
      throw new Error('SentenceWritingActivity did not contain category or flag');
    }
    sentenceWritingActivity.rules = _.map(sentenceWritingActivity.rules, function(r) {
      return {
        ruleId: r.$id,
        quantity: r.quantity
      };
    });

    return crud.save(sentenceWritingActivity);
  };
  this.deleteSentenceWriting = function (sentenceWritingActivity) {
    return crud.del(sentenceWritingActivity);
  };
  this.getSentenceWriting = function(sentenceWritingActivityId) {
    return crud.get(sentenceWritingActivityId);
  };
  return this;
});
