import { request, RequestProps, ERROR_MESSAGES } from "../src/request";
import axios, { AxiosInstance } from "axios";

const onError = jest.fn();
const onLoading = jest.fn();
const onSuccess = jest.fn();

const instance: AxiosInstance = axios.create({
  baseURL: window.location.href,
  timeout: 1000,
  headers: {
    "X-Requested-With": "XMLHttpRequest"
  }
});

export const options: RequestProps & {
  readonly handler: string;
  readonly instance: AxiosInstance;
} = {
  formData: new FormData(),
  handler: "onSave",
  instance: instance,
  onError: onError,
  onLoading: onLoading,
  onSuccess: onSuccess,
  prevent: true
  //  redirect?: string,
};

describe("request", () => {
  it("missing handler", () => {
    expect(() => {
      request({ ...options, handler: "" });
    }).toThrow(ERROR_MESSAGES["handler.required"]);
  });

  it("invalid handler", () => {
    expect(() => {
      request({ ...options, handler: "Save" });
    }).toThrow(ERROR_MESSAGES["handler.invalid"]);
  });

  it("formData isn't an instance of FormData", () => {
    expect(() => {
      // @ts-ignore
      request({ ...options, formData: {} });
    }).toThrow(ERROR_MESSAGES["formData.invalid"]);
  });

  it("onLoading function isn't type of function", () => {
    expect(() => {
      // @ts-ignore
      request({ ...options, onLoading: "aa" });
    }).toThrow(ERROR_MESSAGES["event.not.defined"]("onLoading"));
  });

  it("onLoading function should be emited with true", () => {
    request(options);
    expect(onLoading).toBeCalledWith(true);
  });

  it("onError function should be emited", () => {
    request(options);
    setTimeout(() => {
      expect(onError).toBeCalled();
    }, 1000);
  });

  it("onLoading function should be emited with false", () => {
    request(options);
    setTimeout(() => {
      expect(onLoading).toBeCalledWith(false);
    }, 1000);
  });
});
