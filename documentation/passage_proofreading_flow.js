lets try to describe the entire pathway from visiting the passage proofreading url to returning to the lms
Im going to focus on detail that would be relevant to the project of modifying the code so that scores related to performance in the passage proofreading actiivyt is reported to the lms.




first user visits

/play/pf?uid&brainpop

the code listens for that here :

---
//https://github.com/empirical-org/Quill-Grammar/blob/master/src/scripts/app/play/proofreadings/config.js#L11

'use strict';

module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('play-pf', {
    parent: 'app',
    templateUrl: 'proofreadings.play.html',
    controller: 'ProofreadingPlayCtrl',
    url: '/play/pf?uid&brainpop&student&anonymous',
    data: {
      authenticateUser: true
    }
  })
  ...
};
---
the first state is detected, and so the corresponding templateUrl is rendered, and the corresponding
controller is hooked up to that template, and the parent module is 'app'

now that the user is presented with the proofreading template, how does the users interaction with the passage get handled by the code?

well here is the template that gets shown

---

<div ng-class="{proofreading:true, 'partner-iframe': brainpop}" ng-show="pf">
  <quill-grammar-pf-heading pf="pf" num-changes="numChanges"></quill-grammar-pf-heading>
  <quill-grammar-passage passage="pf.passage" num-changes="numChanges"></quill-grammar-passage>
  <quill-grammar-passage-submit-panel></quill-grammar-passage-submit-panel>

  <div class="proofreading-modal" ng-show="pf.modal.show">
    <input class="modal-state" type="checkbox" ng-checked="pf.modal.show"/>
    <div class="modal-window">
      <div class="modal-inner">
        <h2>{{pf.modal.title}}</h2>
        <p>{{pf.modal.message}}</p>
        <button ng-click="pf.modal.buttonClick()">{{pf.modal.buttonMessage}}</button>
      </div>
    </div>
  </div>

</div>


---
Youll notice that a lot of directive elements are used.
These are defined in the sibling document module.js,
The ProofreadingPlayCtrl Controller is defined in this module, so it will have access to it.
Lets take a look at the directive called quill-grammar-passage. it is defined in the module.js here :

---
.directive('quillGrammarPassage', function () {
  return {
    restrict: 'E',
    controller: 'ProofreadingPlayCtrl',
    scope: {
      passage: '=',
      numChanges: '=',
    },
    templateUrl: 'passage.html'
  };
})
---

Notice that the directive is named in the module using camelCase, but that it appears in the html file as quill-grammar-passage.
Angular knows to translate between the two styles.

Lets now look at the template for that directive

---

<div class="passage">
  <div ng-class="{'word':true, 'error-tooltip-item': !isBr(word.responseText)}" ng-repeat="(index, word) in passage" id="error-tooltip-scroll-{{index}}">
    <p ng-bind-html="space" ng-show="isBr(word.responseText)" id="break-binding-point-{{index}}"></p>
    <input
      autofocus="$first"
      ng-show="!isBr(word.responseText)"
      type="text"
      ng-class="{focused: word.isFocused, incorrectError: hasIncorrectError(word), notNecessaryError: hasNotNecessaryError(word), changed: word.text !== word.responseText, correct: hasCorrect(word), underlined: needsUnderlining(word), tooltipped: word.tooltip.style}"
      ng-readonly="passage.submitted"
      ng-focus="word.isFocused = true"
      ng-change="onInputChange(word)"
      ng-blur="word.isFocused = false"
      ng-size="{{word.responseText.length}}"
      ng-trim="false"
      ng-model="word.responseText">
    </input>
    <div ng-class="getErrorTooltipClass(index)" ng-show="!isBr(word.responseText) && hasErrorToShow(word)"
      ng-style="word.tooltip.style">
      <div ng-class="{incorrectError: hasIncorrectError(word), notNecessaryError: hasNotNecessaryError(word), correct: hasCorrect(word)}">
        <div ng-class="getErrorTooltipTopClass(answerImageName(word.type))">
          <div class="img-div">
            <img ng-src="/assets/images/{{answerImageName(word.type)}}_icon.png" alt="{{word.type}}"></img>
          </div>
          <h4>{{word.type}}</h4>
          <p class="counter">{{errorCounter(word)}}</p>
        </div>
        <div class="bottom-panel">
          <h4>Correct Edit:</h4>
          <p ng-show="word.plus">{{word.plus}}</p>
          <p ng-show="!word.plus">{{word.text}}</p>
          <h4 ng-show="!hasNotNecessaryError(word)">Grammatical Concept:</h4>
          <p ng-show="!hasNotNecessaryError(word)">{{getGrammaticalConceptForWord(word)}}</p>
          <button ng-click="word.nextAction.fn()">{{word.nextAction.title}} ➞</button>
        </div>
      </div>
    </div>
  </div>
</div>


---

A lot going on above. However Im just interested in how correct/incorrect responses get stored, so I think I should be safe to skip over and check out another directives template, f-submit-panel.html (which is also included in proofreadings.play.html)

---
<div ng-class="{'passage-submit-panel': true, 'passage-submitted': pf.passage.submitted}" id="last-chance-tooltip-breakpoint-at-panel">
  <div class="passage-message">
    {{pf.message}}
  </div>
  <button ng-show="!pf.passage.submitted" ng-class="{'no-message': !pf.message}" ng-click="submitPassage()">Check Work</button>
</div>

---
The main thing to notice here is
ng-click="submitPassage()"

Looking at the controller code for this will likely show how correct/incorrect responses get stored
Lets look for the method in the ProofreadingPlayCtrl

---

...

  $scope.submitPassage = function () {
    var passage = $scope.pf.passage;
    function isValid(passageEntry) {
      if (_.has(passageEntry, 'minus')) {
        //A grammar entry
        return passageEntry.responseText === passageEntry.plus;
      } else {
        //A regular word
        return passageEntry.text === passageEntry.responseText;
      }
    }
    function getErrorType(passageEntry) {
      return _.has(passageEntry, 'minus') ? $scope.INCORRECT_ERROR : $scope.NOT_NECESSARY_ERROR;
    }
    $scope.results = [];
    _.each(passage, function (p, i) {
      if (!isValid(p)) {
        $scope.results.push({index: i, passageEntry: p, type: getErrorType(p)});
      }
      if (isValid(p) && _.has(p, 'minus')) {
        $scope.results.push({index: i, passageEntry: p, type: $scope.CORRECT});
      }
    });
    var numErrors = _.keys($scope.passageQuestions).length;
    var numErrorsToSolve = Math.floor(numErrors / 2);
    var numErrorsFound = getNumCorrect($scope.results);
    var numEdits = $scope.numChanges;
    if (numErrorsFound >= numErrorsToSolve ||  numEdits >= numErrorsToSolve) {
      showResultsModal($scope.results, numErrorsFound, numErrors);
    } else {
      showModalNotEnoughFound(numErrorsToSolve);
    }
  };

...

--
so it seems that the results are stored on
$scope.results
There is no further form of storage employed within this method. (perhaps later on)

and each result, if it is correct, has the value $scope.CORRECT for key 'type',
if it is incorrect, it has the value getErrorType(p) for key 'type'.

What is $scope.CORRECT ?

We see at the top of the controller that
$scope.CORRECT = 'Correct'

Is $scope.results stored on something else after the showResultsModal does its thing?
Lets see by checking otu the showResultsModal method
--


  function showResultsModal(results, numErrorsFound, numErrorsToSolve) {
    function createTitle() {
      if (numErrorsFound === numErrorsToSolve) {
        return 'Congratulations!';
      } else if (numErrorsFound >= numErrorsToSolve / 2) {
        return 'Good Work!';
      }
      return '';
    }
    var nf = numErrorsFound === numErrorsToSolve ? 'all ' + String(numErrorsFound) : String(numErrorsFound) + ' of ' + String(numErrorsToSolve);
    var title = createTitle();

    $scope.pf.modal = {
      title: title,
      message: 'You found ' + nf + ' errors.',
      buttonMessage: 'Review Your Work',
      buttonClick: function () {
        $scope.pf.modal.show = false;
        showResults(results);
      },
      show: true
    };
  }

---

no more storage being done here.
lets follow the chain of command and check out the method showResults

---
  function showResults(passageResults) {
    _.each(passageResults, function (pr, i) {
      $scope.pf.passage[pr.index].type = pr.type;
      $scope.pf.passage[pr.index].resultIndex = i;
      $scope.pf.passage[pr.index].ruleNumber = pr.passageEntry.ruleNumber;
      $scope.pf.passage[pr.index].totalResults = passageResults.length;
      $scope.pf.passage[pr.index].nextAction = $scope.nextAction($scope.pf.passage[pr.index], pr.index);
    });
    var ruleNumbers = _.chain(passageResults)
      .pluck('passageEntry')
      .reject(function (r) {
        return r.type !== $scope.INCORRECT_ERROR;
      })
      .pluck('ruleNumber')
      .reject(_.isUndefined)
      .uniq()
      .value();
    generateLesson(ruleNumbers);
    $scope.focusResult(0, passageResults[0].index);
    sendResultsAnalytics(passageResults);
    saveResults(getLocalResults(passageResults));
    $scope.pf.passage.submitted = true;
  }

---


ok we see here a call to generateLesson.
thats interesting.
I would probably want to put that in the logic for the submit button, to be called after the showing results finishes,
instead of making it a chain of comamnd like this (since conceptually its somewhat separate from showing results)
same goes for call to saveResults(getLocalResults(passageResults))

note that passageResults is the $scope.results that was passed in origianlly to showResultsModal.
So that array contains everything we need in terms of a score.

One question, the call to saveResults :

  saveResults(getLocalResults(passageResults));

why do we need to wrap the passageResults in a call to getLocalResults?
I dont recall anywhere in the flow the results being stored anywhere.
lets check out getLocalResults

---

  /*
   * generate passage results for local results
   */

  function getLocalResults(passageResults) {
    var rules = $scope.referencedRules;
    return _.chain(passageResults)
      .pluck('passageEntry')
      .reject(function (pe) {
        return _.isUndefined(pe.ruleNumber);
      })
      .map(function (pe) {
        var rule = _.findWhere(rules, {ruleNumber: Number(pe.ruleNumber)});
        return {
          title: rule.title,
          correct: pe.type === $scope.CORRECT
        };
      })
      .groupBy('title')
      .map(function (entries, title) {
        return {
          conceptClass: title,
          total: entries.length,
          correct: _.filter(entries, function (v) { return v.correct; }).length
        };
      })
      .value();
  }
---

Ok, now I get it (from the comment in the code).
Basically this processes this passageResults to get them into the proper format to be saved locally,
its not that its getting anything from a storage somewhere.
So lets check out this format because well probably need to knwo about it when computing a total score.

One thing I notice which is strange is that the array passageResults is transformed by plucking out
passageEntry, and then transformed again, utilizing the pe.type from each passageEnty (to see if it equals $scope.CORRECT).
The strange thing about this is that I think type is really a property of a passageResult, not of a passageEntry

I would like to make an edit of this.
But how would I go about testing it?
I would need to get the system to produce passageResults,
then see if this method worked properly in identifying which ones were correct

It seems from the submit passage method that $scope.pf.passage is an array, and each individual element becomes a passageEntry
(with no transformation, it just is one)

Lets just assume the above method works for now and see how far we can continue to trace the logic

the output of the above getLocalResults is an array where each element corresponds to a particular rule title, and the data is the number correct for that rule title (grouping corrects / total entries by rule title). The rule title is being called conceptClass here, but that does not have anything to do with ConceptClass (concepts at level 2). Should at some point change the use of name here.
given the informaiton thus transformed, we should still be able to extract a global percentage correct for the passage.
lets now look at where this processed data gets stored exactly.

Remember the method getLocalResults is used in the following line :

saveResults(getLocalResults(passageResults));

so lets take a look at the saveResults method :

---

  function saveResults(r) {
    localStorageService.set('pf-' + $scope.id, r);
    localStorageService.remove('sw-' + $scope.id);
    localStorageService.remove('sw-temp-' + $scope.id);
  }

---

Note that the r in the above will be an array of results grouped by rule title.

Not sure what the purpose of the remove calls is for.

Lets check out what goes on in the service localStorageService and its method set
(also keeping an eye out for a corespnding get method)

---

module.exports =
angular.module('quill-grammar.services.localStorage', [
  'LocalStorageModule',
])
.factory('SentenceLocalStorage', function ($q, localStorageService) {
  function storeTempResult(passageId, crq, answer, correct) {
    var key = 'sw-temp-' + passageId;
    var rs = localStorageService.get(key);
    if (!rs) {
      rs = [];
    }
    rs.push({
      conceptClass: crq.conceptCategory,
      correct: correct,
      answer: answer
    });
    localStorageService.set(key, rs);
  }

  /*
   * Function to map temporary local results into
   */
  function saveLocalResults(passageId) {
    if (passageId) {
      var tempKey = 'sw-temp-' + passageId;
      var trs = localStorageService.get(tempKey);
      var rs = _.chain(trs)
        .groupBy('conceptClass')
        .map(function (entries, cc) {
          return {
            conceptClass: cc,
            total: entries.length,
            correct: _.filter(entries, function (v) { return v.correct; }).length
          };
        })
        .value();
      localStorageService.set('sw-' + passageId, rs);
      localStorageService.remove(tempKey);
      return trs; // Return temp results so they can be sent to the analytics service. Why not just send the final results?
    }
  }

  return {
    storeTempResult: storeTempResult,
    saveResults: saveLocalResults
  };
});

---

Ok, dont seem to see any 'set' method defined above, though it is used.
Perhaps it is defined in the module that this service depends upon, 'LocalStorageModule'.
This module is in fact a node module, downloaded over the internet. This is how its docs describe it is used :

var localStorage = require('localStorage')
  , myValue = { foo: 'bar', baz: 'quux' }
  ;

localStorage.setItem('myKey', JSON.stringify(myValue));
myValue = localStorage.getItem('myKey');

Makes sense.

So localStorageService.set and get are deferring to those methods in localStorageModule.

So if we want to get the results at somewhere down the line, we simply need to make a call to localStorageService.get
with the approapriate key : 'pf-' + $scope.id.

The question is - will we have access to the $scope.id at the relevant time?
Well, what is $scope.id the id of? The passage, or the user?
Becauase we may consider trying to access those results from within the sentences controller (which follows the passages) or from
within the finalizeService. Probably better to do within finalize service because then we are not coupled to the fact that sentence acitivity follow passage activity.

Lets look back in passageCtrl to find out what $scope.id corresponds to

Its value is taken from $state.params.uid, the uid in the url for example
'/play/pf?uid=1'

This uid corresponds to the id of the passage.
It does not corresopnd to the id of the user.
I know this because its used for getting the passage resource from the set of content
ProofreadingService.getProofreading($scope.id)

It would perhaps be better to store the results using the students session id, which is present throughout the session.
Is this possible? Does the state have access to this (can it be passed in the url?)

It is, we can see again in play/proofreadings/config.js :

url: '/play/pf?uid&brainpop&student&anonymous',

So the activity_session_id is available as $state.params.student































