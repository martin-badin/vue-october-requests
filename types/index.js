// @flow

import type { Axios, AxiosInstance } from "axios";

export type SuccessResponse = {
  X_OCTOBER_REDIRECT: string
};

export type ErrorResponse = {
  X_OCTOBER_ERROR_FIELDS: { [key: string]: string },
  X_OCTOBER_ERROR_MESSAGE: string
};

export type RequestProps = {
  formData: FormData,
  handler: string,
  instance: AxiosInstance,
  onError?: mixed => void,
  onLoading?: boolean => void,
  onSuccess?: mixed => void,
  prevent: boolean,
  redirect?: string
};

export type PluginOptions = {
  axios: Axios,
  timeout?: number
};
