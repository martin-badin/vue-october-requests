// @flow

type SuccessResponse = {
  X_OCTOBER_REDIRECT: string
};

type ErrorResponse = {
  X_OCTOBER_ERROR_FIELDS: { [key: string]: string },
  X_OCTOBER_ERROR_MESSAGE: string
};

type Modifiers = {
  prevent: boolean,
  files: boolean
};

type Value = {
  handler: string,
  onError?: mixed => void,
  onSuccess?: mixed => void,
  onLoading?: boolean => void,
  redirect?: string
};

type Binding = {
  modifiers: Modifiers,
  value: Value
};

type Data = {
  el: HTMLElement,
  binding: Binding,
  options: Object
};

const INPUTS = ["text", "email", "password", "hidden", "tel"];

function qs(object: Object) {
  return Object.keys(object).reduce(function(str, key, i) {
    return [
      str,
      i === 0 ? "" : "&",
      encodeURIComponent(key),
      "=",
      encodeURIComponent(object[key])
    ].join("");
  }, "");
}

function prepareData(elements: Array<HTMLElement>): { [key: string]: string } {
  return Array.from(elements).reduce((acc: Object, element: HTMLElement) => {
    switch (element.nodeName) {
      case "INPUT":
        if (INPUTS.includes(element.type)) {
          acc[element.name] = element.value;
        }
        break;
      case "BUTTON":
        break;
      default:
        console.warn(
          "[Vue October Request] not supported element type: ",
          element.nodeName
        );
    }

    return acc;
  }, {});
}

module.exports = {
  init({ el, binding, instance }: Data) {
    const { modifiers, value } = binding;

    if (
      !value.handler ||
      (value.handler && !value.handler.match(/^(?:\w+\:{2})?on*/))
    ) {
      throw new Error(
        'Invalid handler name. The correct handler name format is: "onEvent".'
      );
    }

    if (modifiers.files && typeof FormData === "undefined") {
      throw new Error(
        "This browser does not support file uploads via FormData."
      );
    }

    this.emit = (name, data) => {
      const eventName = `on${name}`;
      const func = value[eventName];

      if (func && typeof func !== "function") {
        throw new Error(`Event ${eventName} must be type of function.`);
      } else if (func) {
        func(data);
      }
    };

    el.addEventListener("submit", (event: Event) => {
      if (modifiers.prevent) {
        event.preventDefault();
      }

      let formData;

      if (modifiers.files) {
        // multipart/form-data
        formData = new FormData(event.target);
      } else {
        // application/x-www-form-urlencoded
        formData = qs(prepareData(event.target.elements));
      }

      this.emit("Loading", true);

      instance
        .post("", formData, {
          headers: {
            "X-OCTOBER-REQUEST-HANDLER": value.handler
          }
        })
        .then((response: { data: SuccessResponse }) => {
          this.emit("Success", response.data);

          if (value.redirect) {
            window.location.href = value.redirect;
          } else if (response.data.X_OCTOBER_REDIRECT) {
            window.location.href = response.data.X_OCTOBER_REDIRECT;
          }
        })
        .catch(err => {
          const response: { data: ErrorResponse } = err.response;
          this.emit("Error", response.data);
        })
        .finally(() => {
          this.emit("Loading", false);
        });
    });
  },
  destroy({ el }: Data) {
    el.removeEventListener("submit");
  }
};
