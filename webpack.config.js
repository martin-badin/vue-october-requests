const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.ts",
    "index.min": "./src/index.ts"
  },
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "VueOctoberRequests",
    umdNamedDefine: true
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};
