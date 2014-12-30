'use-strict';

  
  
function cmsController($scope) {

  /*
   * $scope initializers
   */
  $scope.categories = [{title: '1.1b. Use Common, Proper, and Possessive Nouns.', rules: [
    {
      title: 'Proper Nouns {|11}',
      questions: [
        {displayText: "Someday I will go to China"},
        {displayText: "John Drops his son off at school"},
        {displayText: "The paintings in Italy are Amazing"},
      ]
    },
    {
      title: 'Common Nouns {|10}',
      questions: [
        {displayText: "A cute duck is sewn onto the bag."},
        {displayText: "My father is a policeman"},
        {displayText: "Did you see any sculptures in museum?"},
      ]
    },
    {
      title: 'Possive Nouns {|12}',
      questions: [
        {displayText: "Andy's favorite sport is basketball."},
        {displayText: "The church's towers are magnificent."},
        {displayText: "The ship's sail flaps in the wind."},
      ]
    }
  ]}];

  $scope.saveCategory = function(category) {

  };

}

module.exports = ['$scope', cmsController];
