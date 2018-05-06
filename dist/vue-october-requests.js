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

    Vue.prototype.$request = function (opts) {
      return _request2.default.request(_extends({}, opts, { instance: instance }));
    };

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


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var INPUTS = ["text", "email", "password", "hidden", "tel"];

function qs(object) {
  return Object.keys(object).reduce(function (str, key, i) {
    return [str, i === 0 ? "" : "&", encodeURIComponent(key), "=", encodeURIComponent(object[key])].join("");
  }, "");
}

function prepareFormData(elements) {
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

module.exports = {
  request: function request(_ref) {
    var _this = this;

    var files = _ref.files,
        instance = _ref.instance,
        handler = _ref.handler,
        redirect = _ref.redirect,
        data = _ref.data,
        event = _ref.event,
        bag = _objectWithoutProperties(_ref, ["files", "instance", "handler", "redirect", "data", "event"]);

    if (!handler || handler && !handler.match(/^(?:\w+\:{2})?on*/)) {
      throw new Error('Invalid handler name. The correct handler name format is: "onEvent".');
    }

    if (files && typeof FormData === "undefined") {
      throw new Error("This browser does not support file uploads via FormData.");
    }

    this.emit = function (name, data) {
      var eventName = "on" + name;
      var func = bag[eventName];

      if (func && typeof func !== "function") {
        throw new Error("Event " + eventName + " must be type of function.");
      } else if (func) {
        func(data);
      }
    };

    var formData = void 0;

    if (files) {
      // multipart/form-data
      formData = new FormData(event.target);
    } else {
      // application/x-www-form-urlencoded
      formData = qs(data);
    }

    this.emit("Loading", true);

    instance.post("", formData, {
      headers: {
        "X-OCTOBER-REQUEST-HANDLER": handler
      }
    }).then(function (response) {
      _this.emit("Success", response.data);

      if (redirect) {
        window.location.href = redirect;
      } else if (response.data.X_OCTOBER_REDIRECT) {
        window.location.href = response.data.X_OCTOBER_REDIRECT;
      }
    }).catch(function (err) {
      var response = err.response;
      _this.emit("Error", response.data);
    }).finally(function () {
      _this.emit("Loading", false);
    });
  },
  init: function init(_ref2) {
    var _this2 = this;

    var el = _ref2.el,
        binding = _ref2.binding,
        instance = _ref2.instance;
    var modifiers = binding.modifiers,
        value = binding.value;


    el.addEventListener("submit", function (event) {
      if (modifiers.prevent) {
        event.preventDefault();
      }

      _this2.request(_extends({}, modifiers, value, {
        instance: instance,
        event: event,
        data: prepareFormData(event.target.elements)
      }));
    });
  },
  destroy: function destroy(_ref3) {
    var el = _ref3.el;

    el.removeEventListener("submit");
  }
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=vue-october-requests.js.map