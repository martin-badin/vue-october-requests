import Vue from "vue";
import plugin, { PluginOptions } from "./index";
import axios from "axios";

const options: PluginOptions = {
  axios: axios
};

Vue.use(plugin, options);

describe("plugin", () => {
  const app = new Vue();

  it("is defined", () => {
    expect(app.$october).toBeDefined();
  });

  it("has request function", () => {
    expect(app.$october.request).toBeInstanceOf(Function);
  });

  describe("request", () => {
    it("first parameter is string", () => {
      const mockFn = jest.fn(app.$october.request);
      const payload = {
        formData: new FormData(),
        prevent: true
      };

      mockFn("onLoad", payload);

      expect(mockFn).toBeCalledWith("onLoad", payload);
    });
  });
});
