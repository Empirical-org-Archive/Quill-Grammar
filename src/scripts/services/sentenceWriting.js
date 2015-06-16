'use strict';

/*@ngInject*/
module.exports =
angular.module('quill-grammar.services.sentenceWriting', [
  require('./crud.js').name,
  require('./indexBy.js').name,
])

.factory('SentenceWritingService', function (CrudService, _, IndexService) {
  var crud = new CrudService('sentenceWritings', [
    'flagId', 'categoryId', 'rules', 'title', 'description'
  ], 'activities');

  var catIndex = new IndexService('sentenceWritingsByCategory');

  function checkAndFormatSentenceWritingActivity(swa) {
    var valid = _.every(['category', 'flag'], function (k) {
      if (swa[k] && swa[k].$id) {
        swa[k + 'Id'] = swa[k].$id;
        return true;
      } else {
        return false;
      }
    });
    if (!valid) {
      throw new Error('SentenceWritingActivity did not contain category or flag');
    }
    swa.rules = _.map(swa.rules, function (r) {
      return {
        ruleId: r.$id,
        quantity: r.quantity
      };
    });
    return swa;
  }

  this.saveSentenceWriting = function (sentenceWritingActivity) {
    var swa = checkAndFormatSentenceWritingActivity(sentenceWritingActivity);

    return crud.save(swa).then(function (ref) {
      return catIndex.addElementToEntry(swa.categoryId, ref);
    });
  };

  this.saveSentenceWritingWithId = function (sentenceWritingActivity) {
    var swa = checkAndFormatSentenceWritingActivity(sentenceWritingActivity);
    var id = String(swa.$id);
    return crud.saveWithCustomId(swa).then(function () {
      return catIndex.addElementToEntry(swa.categoryId, id);
    });
  };

  this.updateSentenceWriting = function (sentenceWritingActivity) {
    var swa = checkAndFormatSentenceWritingActivity(sentenceWritingActivity);

    if (!swa.oldCategoryId) {
      throw new Error('Old Category Id not defined');
    }

    return catIndex.removeElementFromEntry(swa.oldCategoryId, swa.$id).then(function () {
      return crud.update(swa).then(function () {
        return catIndex.addElementToEntry(swa.categoryId, swa.$id);
      });
    });
  };

  this.deleteSentenceWriting = function (sentenceWritingActivity) {
    return crud.del(sentenceWritingActivity);
  };
  this.getSentenceWriting = function (sentenceWritingActivityId) {
    return crud.get(sentenceWritingActivityId);
  };

  this.getAllSentenceWritings = function () {
    return crud.all();
  };
  return this;
});
