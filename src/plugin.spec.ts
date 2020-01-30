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
});
