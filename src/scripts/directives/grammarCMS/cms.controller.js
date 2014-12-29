'use-strict';

  
  
function cmsController($scope) {

  /*
   * $scope initializers
   */
  $scope.categories = [{title: '1.1b. Use Common, Proper, and Possessive Nouns.', rules: [
    {
      title: 'Proper Nouns {|11}',
      questions: [
        "Someday I will go to China",
        "John Drops his son off at school",
        "The paintings in Italy are Amazing"
      ]
    },
    {
      title: 'Common Nouns {|10}',
      questions: [
        "A cute duck is sewn onto the bag.",
        "My father is a policeman",
        "Did you see any sculptures in museum?"
      ]
    },
    {
      title: 'Possive Nouns {|12}',
      questions: [
        "Andy's favorite sport is basketball.",
        "The church's towers are magnificent.",
        "The ship's sail flaps in the wind.",
      ]
    }
  ]}];

  $scope.saveCategory = function(category) {

  };

}

module.exports = ['$scope', cmsController];
