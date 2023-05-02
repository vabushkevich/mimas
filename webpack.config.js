const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

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
        test: /\.(png|svg)$/i,
        type: "asset/resource",
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/assets/index.html",
      title: "mimas",
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
    .concat(
      devMode
        ? [new ReactRefreshWebpackPlugin()]
        : [
          new MiniCssExtractPlugin({
            filename: "[name]-[contenthash].css",
          }),
        ]
    ),
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
      "@context": path.resolve(__dirname, "src/context"),
      "@credentials": path.resolve(__dirname, "credentials.json"),
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
