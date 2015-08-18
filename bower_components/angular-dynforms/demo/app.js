angular.module('app', ['dynform'])
  .controller('AppCtrl', ['$scope', function ($scope) {
    $scope.stdFormTemplate = {
      "fieldset": {
        "type": "fieldset",
        "label": "fieldset",
        "fields": {
          "text": {
            "type": "text",
            "label": "text",
            "placeholder": "text"
          },
          "date": {
            "type": "date",
            "label": "date",
            "placeholder": "date"
          },
          "datetime": {
            "type": "datetime",
            "label": "datetime",
            "placeholder": "datetime"
          },
          "datetime-local": {
            "type": "datetime-local",
            "label": "datetime-local",
            "placeholder": "datetime-local"
          },
          "email": {
            "type": "email",
            "label": "email",
            "placeholder": "email"
          },
          "month": {
            "type": "month",
            "label": "month",
            "placeholder": "month"
          },
          "coordinates-fieldset": {
            "type": "fieldset",
            "label": "nested model example",
            "fields": {
              "coordinates.lat": {
                "type": "number",
                "label": "coordinates.lat",
                "placeholder": "coordinates.lat",
                "val": 36.5
              },
              "coordinates.lon": {
                "type": "number",
                "label": "coordinates.lon",
                "placeholder": "coordinates.lon",
                "val": -0.15
              }
            }
          },
          "number": {
            "type": "number",
            "label": "number",
            "placeholder": "number"
          },
          "password": {
            "type": "password",
            "label": "password",
            "placeholder": "password"
          },
          "search": {
            "type": "search",
            "label": "search",
            "placeholder": "search"
          },
          "tel": {
            "type": "tel",
            "label": "tel",
            "placeholder": "tel"
          },
          "textarea": {
            "type": "textarea",
            "label": "textarea",
            "placeholder": "textarea",
            "splitBy": "\n",
            "val": ["This array should be","separated by new lines"]
          },
          "time": {
            "type": "time",
            "label": "time",
            "placeholder": "time"
          },
          "url": {
            "type": "url",
            "label": "url",
            "placeholder": "url"
          },
          "week": {
            "type": "week",
            "label": "week",
            "placeholder": "week"
          }
        }
      },
      "checkbox": {
        "type": "checkbox",
        "label": "checkbox"
      },
      "color": {
        "type": "color",
        "label": "color"
      },
      "file": {
        "type": "file",
        "label": "file",
        "multiple": true
      },
      "range": {
        "type": "range",
        "label": "range",
        "model": "number",
        "val": 42,
        "minValue": -42,
        "maxValue": 84
      },
      "select": {
        "type": "select",
        "label": "select",
        "empty": "nothing selected",
        "options": {
          "first": {
            "label": "first option"
          },
          "second": {
            "label": "second option",
            "group": "first group"
          },
          "third": {
            "label": "third option",
            "group": "second group"
          },
          "fourth": {
            "label": "fourth option",
            "group": "first group"
          },
          "fifth": {
            "label": "fifth option"
          },
          "sixth": {
            "label": "sixth option",
            "group": "second group"
          },
          "seventh": {
            "label": "seventh option"
          },
          "eighth": {
            "label": "eighth option",
            "group": "first group"
          },
          "ninth": {
            "label": "ninth option",
            "group": "second group"
          },
          "tenth": {
            "label": "tenth option"
          }
        }
      },
      "checklist": {
        "type": "checklist",
        "label": "checklist",
        "options": {
          "first": {
            "label": "first option"
          },
          "second": {
            "label": "second option",
            "isOn": "on",   //  If you use Angular versions 1.3.x and up, this needs to be changed to "'on'"...
            "isOff": "off"  //  If you use Angular versions 1.3.x and up, this needs to be changed to "'off'"...
          }
        }
      },
      "radio": {
        "type": "radio",
        "label": "radio",
        "values": {
          "first": "first option",
          "second": "second option",
          "third": "third option",
          "fourth": "fourth option",
          "fifth": "fifth option"
        }
      },
      "button": {
        "type": "button",
        "label": "button"
      },
      "hidden": {
        "type": "hidden",
        "label": "hidden",
        "val": "hidden"
      },
      "image": {
        "type": "image",
        "label": "image",
        "source": "http://angularjs.org/img/AngularJS-large.png"
      },
      "legend": {
        "type": "legend",
        "label": "legend"
      },
      "reset": {
        "type": "reset",
        "label": "reset"
      },
      "submit": {
        "type": "submit",
        "label": "submit"
      },
      "bogus": {
        "type": "bogus",
        "label": "bogus"
      }
    };
    $scope.stdFormData = {};
    $scope.urlFormData = {};
  }])
  .filter('pretty', function() {
    return function (input) {
      var temp;
      try {
        temp = angular.fromJson(input);
      }
      catch (e) {
        temp = input;
      }
      
      return angular.toJson(temp, true);
    };
  });
