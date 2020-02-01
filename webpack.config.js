const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.ts"
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
  // devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};
