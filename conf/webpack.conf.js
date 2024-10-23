const path = require('path');
const webpack = require('webpack');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { EsbuildPlugin } = require('esbuild-loader');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const DotenvWebpack = require('dotenv-webpack');
const { commonPaths, moduleNames } = require('./common');

module.exports = (env, argv) => {
    // 개발 모드 (--mode=development) / 배포 모드 (--mode=production).
    const isDevelopmentMode = true;

    // ===============================================
    // 프로젝트 관련 경로들.

    const { rootPath, srcPath, outPath, modulePath } = commonPaths;

    // ===============================================
    // 코드 컴파일(변환) 정의.

    // sass / scss -> css.
    const sass2css = 'sass-loader';

    // css module -> css.
    // https://velog.io/@kwonh/React-CSS를-작성하는-방법들-css-module-sass-css-in-js
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

    // css -> .css file.
    const css2file = MiniCssExtractPlugin.loader;

    // svg -> React component.
    const svg2inline = '@svgr/webpack';

    // ===============================================
    // 테스트 웹 서버 설정.

    const serverIP = '0.0.0.0';
    const localIP = '127.0.0.1';
    const serverPort = 8081;

    // ===============================================
    // Webpack alias 등 정의.

    const urlTarget = process.env.URL_TARGET || 'local';
    // const envPath = path.join(modulePath, 'superux-runtime', 'conf', `.env.${urlTarget}`);

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
            template: path.join(srcPath, 'Template.html'),
            filename: path.join(outPath, 'index.html'),
        }),
        // 리소스 등 필요 파일들 복사.
        // new CopyPlugin({
        //     patterns: [
        //         { from: path.join(srcPath, 'common/resource/locales'), to: path.join(outPath, 'locales') },
        //         { from: path.join(srcPath, 'common/resource/runtime'), to: path.join(outPath, 'runtime') },
        //         {
        //             from: path.join(srcPath, 'common/resource/import-libraries'),
        //             to: path.join(outPath, 'import-libraries'),
        //         },
        //         {
        //             from: path.join(srcPath, 'common/resource/studio-component'),
        //             to: path.join(outPath, 'studio-component'),
        //         },
        //         {
        //             from: path.join(srcPath, 'common/resource/favicon'),
        //             to: path.join(outPath, 'favicon'),
        //         },
        //     ],
        // }),
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
    // ===============================================
    // 최종 configuration.

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
