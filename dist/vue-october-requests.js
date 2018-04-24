(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("vue-october-requests", [], factory);
	else if(typeof exports === 'object')
		exports["vue-october-requests"] = factory();
	else
		root["vue-october-requests"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _request = __webpack_require__(1);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!options.axios) {
      throw new Error("Axios option is not specified.");
    }

    var instance = options.axios.create({
      baseURL: window.location.href,
      timeout: 1000,
      headers: { "X-Requested-With": "XMLHttpRequest" }
    });

    Vue.directive("october", {
      bind: function bind(el, binding) {
        if (binding.arg === "request") {
          _request2.default.init({ el: el, binding: binding, instance: instance });
        }
      },
      unbind: function unbind(el, binding) {
        if (binding.arg === "request") {
          _request2.default.destroy({ el: el });
        }
      }
    });
  }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var INPUTS = ["text", "email", "password", "hidden", "tel"];

function qs(object) {
  return Object.keys(object).reduce(function (str, key, i) {
    return [str, i === 0 ? "" : "&", encodeURIComponent(key), "=", encodeURIComponent(object[key])].join("");
  }, "");
}

function prepareData(elements) {
  return Array.from(elements).reduce(function (acc, element) {
    switch (element.nodeName) {
      case "INPUT":
        if (INPUTS.includes(element.type)) {
          acc[element.name] = element.value;
        }
        break;
      case "BUTTON":
        break;
      default:
        console.warn("[Vue October Request] not supported element type: ", element.nodeName);
    }

    return acc;
  }, {});
}

// function extractPartials(update) {
//   const result = [];

//   for (const partial in update) {
//     result.push(partial);
//   }

//   return result.join('&');
// }

module.exports = {
  init: function init(_ref) {
    var _this = this;

    var el = _ref.el,
        binding = _ref.binding,
        instance = _ref.instance;
    var modifiers = binding.modifiers,
        value = binding.value;


    if (!value.handler || value.handler && !value.handler.match(/^(?:\w+\:{2})?on*/)) {
      throw new Error('Invalid handler name. The correct handler name format is: "onEvent".');
    }

    this.emit = function (name, data) {
      var eventName = "on" + name;
      var func = value[eventName];

      if (func && typeof func !== "function") {
        throw new Error("Event " + eventName + " must be type of function.");
      } else if (func) {
        func(data);
      }
    };

    el.addEventListener("submit", function (event) {
      if (modifiers.prevent) {
        event.preventDefault();
      }

      _this.emit("Loading", true);

      instance.post("", qs(prepareData(event.target.elements)), {
        headers: {
          "X-OCTOBER-REQUEST-HANDLER": value.handler
        }
      }).then(function (response) {
        _this.emit("Success", response.data);

        if (value.redirect) {
          window.location.href = value.redirect;
        } else if (response.data.X_OCTOBER_REDIRECT) {
          window.location.href = response.data.X_OCTOBER_REDIRECT;
        }
      }).catch(function (err) {
        var response = err.response;
        _this.emit("Error", response.data);
      }).finally(function () {
        _this.emit("Loading", false);
      });
    });
  },
  destroy: function destroy(_ref2) {
    var el = _ref2.el;

    el.removeEventListener("submit");
  }
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=vue-october-requests.js.map