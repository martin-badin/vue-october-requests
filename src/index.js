// @flow

import request from "./request";

type Options = {
  axios: Object
};

module.exports = {
  install: (Vue, options: Options = {}) => {
    if (!options.axios) {
      throw new Error("Axios option is not specified.");
    }

    const instance = options.axios.create({
      baseURL: window.location.href,
      timeout: 1000,
      headers: { "X-Requested-With": "XMLHttpRequest" }
    });

    Vue.directive("october", {
      bind(el, binding) {
        if (binding.arg === "request") {
          request.init({ el, binding, instance });
        }
      },
      unbind(el, binding) {
        if (binding.arg === "request") {
          request.destroy({ el });
        }
      }
    });
  }
};
