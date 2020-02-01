import { AxiosInstance, AxiosStatic } from "axios";
import { PluginObject } from "vue/types/plugin";
import { DirectiveBinding } from "vue/types/options";
import { request, RequestProps, ERROR_MESSAGES } from "./request";

export interface PluginOptions {
  readonly axios: AxiosStatic;
  readonly timeout?: number;
  readonly headers?: Readonly<Record<string, string>>;
}

export type RequestFunction = {
  (handler: string, options: RequestProps): () => void;
};

const plugin = {
  install: (Vue, pluginOptions) => {
    if (!pluginOptions) {
      throw new Error("Plugin options are not specified.");
    }

    const { axios, timeout, headers, ...options } = pluginOptions;

    if (!axios) {
      throw new Error("Axios option is not specified.");
    }

    const instance: AxiosInstance = axios.create({
      baseURL: window.location.href,
      timeout: timeout || 1000,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        ...(headers || {})
      },
      ...options
    });

    Vue.prototype.$october = {
      request(h: string, p: RequestProps) {
        if (typeof h !== "string") {
          throw new Error(ERROR_MESSAGES["handler.required"]);
        }

        return request({ ...p, handler: h, instance });
      }
    };

    const listener = (binding?: DirectiveBinding) => {
      return (event: Event) => {
        if (!binding) {
          return;
        }

        if (binding.modifiers.prevent) {
          event.preventDefault();
        }

        const formElement = event.target as HTMLFormElement;

        if (formElement) {
          request({
            ...binding.modifiers,
            ...binding.value,
            instance,
            formData: new FormData(formElement)
          });
        }
      };
    };

    Vue.directive("october", {
      bind(el, binding) {
        if (binding.arg === "request") {
          if (!(el instanceof HTMLFormElement)) {
            throw new Error("The element is not instance of HTMLFormElement");
          }

          el.addEventListener("submit", listener(binding));
        }
      },
      unbind(el, binding) {
        if (binding.arg === "request") {
          el.removeEventListener("submit", listener());
        }
      }
    });
  }
} as PluginObject<PluginOptions>;

export default plugin;

declare module "vue/types/vue" {
  interface Vue {
    $october: {
      request: RequestFunction;
    };
  }
}
