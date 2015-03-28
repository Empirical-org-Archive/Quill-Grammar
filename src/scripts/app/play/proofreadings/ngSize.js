'use strict';

module.exports = function(){
	return {
		restrict: 'A',
		link: function(scope,element,attrs){
			attrs.$observe('ngSize', function setSize() {
        var size = Number(attrs.ngSize) === 0 ? 1 : Number(attrs.ngSize);
        attrs.$set('size', size);
			});
		}
	};
};
