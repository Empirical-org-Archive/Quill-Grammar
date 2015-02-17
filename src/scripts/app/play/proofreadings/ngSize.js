'use strict';

module.exports = function(){
	return {
		restrict: 'A',
		link: function(scope,element,attrs){
			attrs.$observe('ngSize', function setSize() {
        attrs.$set('size', attrs.ngSize);
			});
		}
	};
};
