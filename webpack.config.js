require("dotenv").config();

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { DefinePlugin } = require("webpack");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  devServer: {
    historyApiFallback: true,
  },
  entry: "./src/index.tsx",
  output: {
    assetModuleFilename: "[name]-[hash][ext][query]",
    clean: true,
    filename: "[name]-[contenthash].js",
    hashDigestLength: 6,
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
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.tsx?$/i,
        use: {
          loader: "babel-loader",
          options: {
            plugins: devMode ? ["react-refresh/babel"] : [],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.png$/i,
        type: "asset/resource",
      },
      {
        test: /\.svg$/i,
        oneOf: [
          { resourceQuery: /inline/, type: "asset/inline" },
          { resourceQuery: /external/, type: "asset/resource" },
          { issuer: { not: /\.[jt]sx?$/ }, type: "asset/resource" },
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /external|inline/ },
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              replaceAttrValues: {
                "#000": "currentColor",
              },
              svgoConfig: {
                plugins: ["preset-default", "removeXMLNS"],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/assets/index.html",
      title: "mimas - a web client for Reddit",
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
    new DefinePlugin({
      "process.env.REDDIT_APP_CLIENT_ID": JSON.stringify(
        process.env.REDDIT_APP_CLIENT_ID,
      ),
    }),
  ].concat(
    devMode
      ? [new ReactRefreshWebpackPlugin()]
      : [
          new MiniCssExtractPlugin({
            filename: "[name]-[contenthash].css",
          }),
        ],
  ),
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
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
  stats: {
    loggingDebug: ["sass-loader"],
  },
};
