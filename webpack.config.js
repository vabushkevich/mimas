const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  devServer: {
    historyApiFallback: true,
  },
  entry: "./src/index.tsx",
  output: {
    publicPath: "/",
  },
  mode: devMode ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/i,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.tsx?$/i,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg)$/i,
        type: "asset/resource",
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/assets/index.html",
      title: "Reddit",
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
  ]
    .concat(devMode ? [] : [new MiniCssExtractPlugin()]),
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@context": path.resolve(__dirname, "src/context"),
      "@hooks": path.resolve(__dirname, "src/hooks.ts"),
      "@sass": path.resolve(__dirname, "src/sass"),
      "@services": path.resolve(__dirname, "src/services"),
      "@store": path.resolve(__dirname, "src/store"),
      "@types": path.resolve(__dirname, "src/types.ts"),
      "@utils": path.resolve(__dirname, "src/utils.ts"),
    },
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
};
