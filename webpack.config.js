const path = require("path");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

let config = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    jsonpFunction: `webpackJsonp_amis_editor`,
    globalObject: 'window',
  },
  module: {
    rules: [
      {
        test: /\.(ttf|woff|woff2|eot|png|jpg|svg)$/,
        use: ["file-loader", "url-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      { test: /\.js$/, use: "babel-loader" },
    ],
  },
  plugins: [new MonacoWebpackPlugin()],
  devServer: {
    compress: true, // 启动Gzip
    port: 3030, // 端口
    open: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
  }
};
module.exports = config;
