'use strict';

module.exports =

/*@ngInject*/
function InternalResultsController(
  $scope, $state
) {
  $scope.partnerIframe = $state.params.partnerIframe;

  /*
   * This is some extra stuff for the partner integration
   * TODO move this out of here
   */
  //Add in some custom images for the 3 stories we are showcasing
  $scope.pfImages = {
    '70B-T6vLMTM9zjQ9LCwoCg': 'the_princes_and_the_turtle_story_header.png',
    'MJCtkml_69W2Dav79v4r9Q': 'ernest_shackleton_story_header.png',
    'Yh49ICvX_YME8ui7cDoFXQ': 'the_apollo_8_photograph_story_header.png'
  };

  $scope.pfTitles = {
    '70B-T6vLMTM9zjQ9LCwoCg': 'The Princes and the Turtle',
    'MJCtkml_69W2Dav79v4r9Q': 'Ernest Shackleton Escapes the Antarctic',
    'Yh49ICvX_YME8ui7cDoFXQ': 'The Apollo 8 Photograph'
  };

  if ($state.params.passageId) {
    $scope.passageImageUrl = $scope.pfImages[$state.params.passageId];
    $scope.passageTitle = $scope.pfTitles[$state.params.passageId];
  }



};
