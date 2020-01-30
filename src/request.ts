import { AxiosResponse, AxiosInstance } from "axios";

export interface SuccessResponse {
  readonly X_OCTOBER_REDIRECT: string;
}

export interface ErrorResponse {
  readonly X_OCTOBER_ERROR_FIELDS: Readonly<Record<string, string>>;
  readonly X_OCTOBER_ERROR_MESSAGE: string;
}

export interface RequestProps {
  readonly formData: FormData | null;
  readonly handler: string;
  readonly instance: AxiosInstance;
  readonly onError?: (value: any) => void;
  readonly onLoading?: (value: boolean) => void;
  readonly onSuccess?: (value: any) => void;
  readonly prevent: boolean;
  readonly redirect?: string;
}

export type RequestFunction = {
  (options: RequestProps): () => void;
};

export const ERROR_MESSAGES = {
  "handle.required": "Handler name is required",
  "handle.invalid":
    'Invalid handler name. The correct handler name format is: "onEvent".',

  "formData.invalid": "The formData is not instance of FormData",

  "event.not.defined": (value: string) =>
    `Event ${value} must be type of function.`
};

export function request({
  formData,
  handler,
  instance,
  redirect,
  ...bag
}: RequestProps) {
  if (!handler) {
    throw new Error(ERROR_MESSAGES["handle.required"]);
  }

  if (handler && !handler.match(/^(?:\w+\:{2})?on*/)) {
    throw new Error(ERROR_MESSAGES["handle.invalid"]);
  }

  if (formData && !(formData instanceof FormData)) {
    throw new Error(ERROR_MESSAGES["formData.invalid"]);
  }

  function emit<T>(name: "Loading" | "Error" | "Success", data: T | undefined) {
    const eventName = `on${name}`;
    const func = (bag as Record<string, any>)[eventName];

    if (typeof func !== "function") {
      throw new Error(ERROR_MESSAGES["event.not.defined"](eventName));
    }

    func(data);
  }

  emit("Loading", true);

  instance
    .post("", formData, {
      headers: {
        "X-OCTOBER-REQUEST-HANDLER": handler
      }
    })
    .then((response: AxiosResponse<SuccessResponse>) => {
      emit("Success", response);

      if (redirect) {
        window.location.href = redirect;
      } else if (response.data.X_OCTOBER_REDIRECT) {
        window.location.href = response.data.X_OCTOBER_REDIRECT;
      }

      emit("Loading", false);
    })
    .catch(err => {
      emit("Error", err);
      emit("Loading", false);
    });
}
