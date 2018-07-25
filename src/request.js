// @flow

import type { SuccessResponse, RequestProps } from "../types";

export function request({
  formData,
  handler,
  instance,
  redirect,
  ...bag
}: RequestProps) {
  if (!handler || (handler && !handler.match(/^(?:\w+\:{2})?on*/))) {
    throw new Error(
      'Invalid handler name. The correct handler name format is: "onEvent".'
    );
  }

  if (formData && !(formData instanceof FormData)) {
    throw new Error("The formData is not instance of FormData");
  }

  function emit(name: string, data: mixed) {
    const eventName = `on${name}`;
    const func = bag[eventName];

    if (func && typeof func !== "function") {
      throw new Error(`Event ${eventName} must be type of function.`);
    }

    func(data);
  }

  emit("Loading", true);

  instance
    .post("", formData || null, {
      headers: {
        "X-OCTOBER-REQUEST-HANDLER": handler
      }
    })
    .then((response: { data: SuccessResponse }) => {
      emit("Success", response);

      if (redirect) {
        window.location.href = redirect;
      } else if (response.data.X_OCTOBER_REDIRECT) {
        window.location.href = response.data.X_OCTOBER_REDIRECT;
      }
    })
    .catch(err => {
      emit("Error", err);
    })
    .finally(() => {
      emit("Loading", false);
    });
}
