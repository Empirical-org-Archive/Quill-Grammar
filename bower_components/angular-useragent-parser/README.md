[![Bower version](https://badge.fury.io/bo/angular-useragent-parser.svg)](http://badge.fury.io/bo/angular-useragent-parser)
# angular-useragent-parser
AngularJS Constant for dependency injection of [UAParser.js](https://github.com/faisalman/ua-parser-js) whithout registering it in the global scope.

## Bower install

```sh
$ bower install angular-useragent-parser
```

## How to use

1. Import the ```angular-useragent-parser.min.js``` script in your page.

2. Include the module ```angular-useragent-parser``` in your angular app.

3. Use the AUParser Constant in your code:

```javascript
angular.module('exampleApp', ['angular-useragent-parser'])
.controller('ExampleCtrl', ['$scope', 'UAParser', function($scope, UAParser){
	var uaParser = new UAParser();
	$scope.customUA = uaParser.getResult();
}]);
```

_See example in [demo code](https://github.com/the-darc/angular-useragent-parser/blob/master/demo/index.html)_

## License

The MIT License (MIT)

Copyright (c) 2015 Daniel Campos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
