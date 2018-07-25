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


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _request2 = __webpack_require__(1);

module.exports = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!options.axios) {
      throw new Error("Axios option is not specified.");
    }

    var instance = options.axios.create({
      baseURL: window.location.href,
      timeout: options.timeout || 1000,
      headers: { "X-Requested-With": "XMLHttpRequest" }
    });

    Vue.prototype.$october = {
      request: function request() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return (0, _request2.request)(_extends({}, props, { instance: instance }));
      }
    };

    Vue.directive("october", {
      bind: function bind(el, binding) {
        if (binding.arg === "request") {
          if (!(el instanceof HTMLFormElement)) {
            throw new Error("The element is not instance of HTMLFormElement");
          }

          el.addEventListener("submit", function (event) {
            if (binding.modifiers.prevent) {
              event.preventDefault();
            }

            (0, _request2.request)(_extends({}, binding.modifiers, binding.value, {
              instance: instance,
              formData: new FormData(event.target)
            }));
          });
        }
      },
      unbind: function unbind(el, binding) {
        if (binding.arg === "request") {
          el.removeEventListener("submit");
        }
      }
    });
  }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = request;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function request(_ref) {
  var formData = _ref.formData,
      handler = _ref.handler,
      instance = _ref.instance,
      redirect = _ref.redirect,
      bag = _objectWithoutProperties(_ref, ["formData", "handler", "instance", "redirect"]);

  if (!handler || handler && !handler.match(/^(?:\w+\:{2})?on*/)) {
    throw new Error('Invalid handler name. The correct handler name format is: "onEvent".');
  }

  if (formData && !(formData instanceof FormData)) {
    throw new Error("The formData is not instance of FormData");
  }

  function emit(name, data) {
    var eventName = "on" + name;
    var func = bag[eventName];

    if (func && typeof func !== "function") {
      throw new Error("Event " + eventName + " must be type of function.");
    }

    func(data);
  }

  emit("Loading", true);

  instance.post("", formData || null, {
    headers: {
      "X-OCTOBER-REQUEST-HANDLER": handler
    }
  }).then(function (response) {
    emit("Success", response);

    if (redirect) {
      window.location.href = redirect;
    } else if (response.data.X_OCTOBER_REDIRECT) {
      window.location.href = response.data.X_OCTOBER_REDIRECT;
    }
  }).catch(function (err) {
    emit("Error", err);
  }).finally(function () {
    emit("Loading", false);
  });
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=vue-october-requests.js.map