import { AxiosResponse, AxiosInstance } from "axios";

export interface SuccessResponse {
  readonly X_OCTOBER_REDIRECT: string;
}

export interface ErrorResponse {
  readonly X_OCTOBER_ERROR_FIELDS: Readonly<Record<string, string>>;
  readonly X_OCTOBER_ERROR_MESSAGE: string;
}

export interface RequestProps {
  readonly formData: FormData;
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

  function emit<T>(name: "Loading" | "Error" | "Success", data: T) {
    const eventName = `on${name}`;
    const func = (bag as Record<string, any>)[eventName];

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
