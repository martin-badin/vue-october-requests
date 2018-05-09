// @flow

import { request, type Props } from "./request";
import type { Axios } from "axios";
import type { Vue as VueType, VNodeDirective } from "vue";

type Options = {
  axios: Axios
};

module.exports = {
  install: (Vue: VueType, options: Options = {}) => {
    if (!options.axios) {
      throw new Error("Axios option is not specified.");
    }

    const instance = options.axios.create({
      baseURL: window.location.href,
      timeout: 1000,
      headers: { "X-Requested-With": "XMLHttpRequest" }
    });

    Vue.prototype.$october = {
      request(props: Props & { formData: FormData } = {}) {
        if (!props.formData && !props.handler) {
          throw new Error("Props the formData and the handler are required");
        }

        if (
          !props.formData ||
          (props.formData && !(props.formData instanceof FormData))
        ) {
          throw new Error("The formData is not instance of FormData");
        }

        return request({ ...props, instance });
      }
    };

    Vue.directive("october", {
      bind(el: HTMLFormElement, binding: VNodeDirective) {
        if (binding.arg === "request") {
          const { modifiers, value } = binding;

          if (!(el instanceof HTMLFormElement)) {
            throw new Error("The element is not instance of HTMLFormElement");
          }

          el.addEventListener("submit", (event: Event) => {
            if (modifiers.prevent) {
              event.preventDefault();
            }

            request({
              ...modifiers,
              ...value,
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
