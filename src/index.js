// @flow

import { request } from "./request";
import type { AxiosInstance } from "axios";
import type { Vue as TVue, VNodeDirective } from "vue";
import type { PluginOptions, RequestProps } from "../types";

module.exports = {
  install: (Vue: TVue, options: PluginOptions = {}) => {
    if (!options.axios) {
      throw new Error("Axios option is not specified.");
    }

    const instance: AxiosInstance = options.axios.create({
      baseURL: window.location.href,
      timeout: options.timeout || 1000,
      headers: { "X-Requested-With": "XMLHttpRequest" }
    });

    Vue.prototype.$october = {
      request(props: RequestProps = {}) {
        return request({ ...props, instance });
      }
    };

    Vue.directive("october", {
      bind(el: HTMLFormElement, binding: VNodeDirective) {
        if (binding.arg === "request") {
          if (!(el instanceof HTMLFormElement)) {
            throw new Error("The element is not instance of HTMLFormElement");
          }

          el.addEventListener("submit", (event: Event) => {
            if (binding.modifiers.prevent) {
              event.preventDefault();
            }

            request({
              ...binding.modifiers,
              ...binding.value,
              instance,
              formData: new FormData(event.target)
            });
          });
        }
      },
      unbind(el: HTMLFormElement, binding: VNodeDirective) {
        if (binding.arg === "request") {
          el.removeEventListener("submit");
        }
      }
    });
  }
};
