const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    app: "./build/app"
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 500
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    chunkFilename: "[name].[contenthash:8].chunk.js",
    module: true,
    libraryTarget: "module"
  },
  experiments: {
    outputModule: true
  },
  cache: {
    type: "filesystem",
    cacheDirectory: path.resolve(__dirname, ".webpack_cache"),
    buildDependencies: {
      config: [__filename]
    }
  },
  module: {
    rules: [
      {
        test: /worker.js$/,
        use: {
          loader: "worker-loader",
          options: {
            name: "[name].[contenthash:8].js",
            esModule: true
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /views\/.*\.html$/,
        use: {
          loader: "html-loader",
          options: {
            esModule: true
          }
        }
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 1024
          }
        },
        generator: {
          filename: "[name].[contenthash:8][ext]"
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: "asset/resource",
        generator: {
          filename: "[name].[contenthash:8][ext]"
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      BUILD_DATE: new Date().getTime(),
      VERSION: JSON.stringify(require("./package.json").version)
    }),
    new CleanWebpackPlugin(["dist/*"], {
      root: __dirname
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      chunks: ["app"],
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
      chunkFilename: "[name].[contenthash:8].chunk.css"
    }),
    new CopyWebpackPlugin([{ from: "src/assets/", to: "." }])
  ],
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      "@app": path.resolve(__dirname, "src/js/app/"),
      "@worker": path.resolve(__dirname, "src/js/worker/"),
      "@utils": path.resolve(__dirname, "src/js/utils/")
    }
  }
};
