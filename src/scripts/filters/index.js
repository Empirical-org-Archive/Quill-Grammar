'use strict';

module.exports =

angular.module('quill-grammar.filters', [])
.filter('trustedHtml', require('./trustedHtml.js'));
