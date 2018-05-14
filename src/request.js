// @flow

import type { AxiosInstance } from "axios";

type SuccessResponse = {
  X_OCTOBER_REDIRECT: string
};

type ErrorResponse = {
  X_OCTOBER_ERROR_FIELDS: { [key: string]: string },
  X_OCTOBER_ERROR_MESSAGE: string
};

type Modifiers = {
  prevent: boolean
};

type Value = {
  handler: string,
  onError?: mixed => void,
  onLoading?: boolean => void,
  onSuccess?: mixed => void,
  redirect?: string
};

export type Props = Value & Modifiers;

type RequestProps = Props & { instance: AxiosInstance, formData?: FormData };

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

  function emit(name, data) {
    const eventName = `on${name}`;
    const func = bag[eventName];

    if (func && typeof func !== "function") {
      throw new Error(`Event ${eventName} must be type of function.`);
    } else if (func) {
      func(data);
    }
  }

  emit("Loading", true);

  instance
    .post("", formData || null, {
      headers: {
        "X-OCTOBER-REQUEST-HANDLER": handler
      }
    })
    .then((response: { data: SuccessResponse }) => {
      emit("Success", response.data);

      if (redirect) {
        window.location.href = redirect;
      } else if (response.data.X_OCTOBER_REDIRECT) {
        window.location.href = response.data.X_OCTOBER_REDIRECT;
      }
    })
    .catch(err => {
      const response: { data: ErrorResponse } = err.response;
      emit("Error", response.data);
    })
    .finally(() => {
      emit("Loading", false);
    });
}
