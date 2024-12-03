const path = require('path');
const webpack = require('webpack');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { EsbuildPlugin } = require('esbuild-loader');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { commonPaths } = require('./common');

module.exports = () => {
  const isDevelopmentMode = true;

  const { rootPath, srcPath, outPath } = commonPaths;

  // sass / scss -> css.
  const sass2css = 'sass-loader';

  // css module -> css.
  const cssModule2css = {
    loader: 'css-loader',
    options: {
      modules: {
        mode: 'local',
        // class 이름이 "파일경로-파일이름__선택자--해시" 식으로 생성됨.
        localIdentName: '[path][name]__[local]--[hash:base64:5]',
      },
    },
  };

  // css -> css.
  const css2css = 'css-loader';

  // css -> <style> tag.
  const css2inline = 'style-loader';

  // svg -> React component.
  const svg2inline = '@svgr/webpack';

  // ===============================================
  // 테스트 웹 서버 설정.

  const serverIP = '0.0.0.0';
  const localIP = '127.0.0.1';
  const serverPort = 8081;

  const plugins = [
    new CircularDependencyPlugin({
      exclude: /node_modules|src\/module/,
      include: /src/,
      failOnError: false,
      allowAsyncCycles: false,
      cwd: rootPath,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        mode: 'write-references',
        configFile: path.join(rootPath, 'tsconfig.json'),
      },
    }),
  ];

  const optimization = isDevelopmentMode
    ? {
        splitChunks: {
          chunks: 'all',
        },
      }
    : {
        splitChunks: {
          chunks: 'all',
        },
        minimize: true,
        minimizer: [
          new EsbuildPlugin({
            css: true,
          }),
        ],
      };

  return {
    entry: path.join(srcPath, 'index.tsx'),
    target: ['web', 'es2020'],
    devtool: isDevelopmentMode ? 'source-map' : 'source-map',
    output: {
      path: outPath,
      filename: '[name].[contenthash].js',
    },
    optimization,
    resolve: {
      modules: ['node_modules', `${srcPath}/`],
      extensions: ['.ts', '.tsx', '.js'],
      fallback: {
        tty: false,
        os: false,
        crypto: false,
        https: false,
        http: false,
        zlib: false,
        buffer: false,
        util: false,
        stream: false,
      },
    },
    module: {
      // 배열 "use: []" 안에 있는 loader들은 가장 뒤에 있는 것부터 역순으로 적용됨에 유의.
      rules: [
        // { test: /\.tsx?$/, loader: 'ts-loader', options: { transpileOnly: true } },
        {
          test: /\.[jt]sx?$/,
          loader: 'esbuild-loader',
          exclude: /node_modules/,
          options: {
            target: 'es2020',
          },
        },
        // src는 CSS module 적용, 그 외는 global css로 처리.
        { include: srcPath, test: /\.(css|scss)$/, use: [css2inline, cssModule2css, sass2css] },
        { exclude: srcPath, test: /\.(css|scss)$/, use: [css2inline, css2css, sass2css] },
        { test: /\.svg$/, use: [svg2inline] },
        { test: /\.(ttf|woff|woff2|png|gif)$/, type: 'asset/resource' },
      ],
    },
    plugins,
    devServer: {
      host: serverIP,
      port: serverPort,
      hot: true,
      open: true,
      static: [outPath],
      open: `http://${localIP}:${serverPort}`,
      historyApiFallback: {
        disableDotRule: true,
      },
      client: {
        // Warning(ex. Circular dependency)이나 error가 뜨면 페이지 이동시마다 로그 창이 뜨는데, 그걸 off.
        overlay: false,
      },
      devMiddleware: {
        // webpack-dev-server는 기본적으로 결과물 파일들을 디스크에 쓰지 않고 메모리 위에 올리는데,
        // 그러면 HTML 파일은 outPath에 미리 존재해야 함 & 결과물 파일 직접 확인이 안 됨.
        // 따라서, webpack-dev-server가 결과물 파일들을 디스크에 쓰도록 강제.
        writeToDisk: false,
      },
    },
  };
};
