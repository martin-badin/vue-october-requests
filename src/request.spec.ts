import { request, RequestProps, ERROR_MESSAGES } from "./request";
import axios from "axios";

const onError = jest.fn();
const onLoading = jest.fn();
const onSuccess = jest.fn();

export const options: RequestProps = {
  formData: new FormData(),
  handler: "onSave",
  instance: axios,
  onError: onError,
  onLoading: onLoading,
  onSuccess: onSuccess,
  prevent: true
  //  redirect?: string,
};

describe("request", () => {
  it("missing handler", () => {
    expect(() => {
      // tslint:disable-next-line
      request({ handler: "" });
    }).toThrow(ERROR_MESSAGES["handle.required"]);
  });

  it("invalid handler", () => {
    expect(() => {
      // tslint:disable-next-line
      request({ handler: "Save" });
    }).toThrow(ERROR_MESSAGES["handle.invalid"]);
  });

  it("formData aren't an instance of FormData", () => {
    expect(() => {
      // tslint:disable-next-line
      request({ handler: options.handler, formData: {} });
    }).toThrow(ERROR_MESSAGES["formData.invalid"]);
  });

  it("onLoading function isn't defined", () => {
    expect(() => {
      // tslint:disable-next-line
      request({ handler: options.handler, formData: null });
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
