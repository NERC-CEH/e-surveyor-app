/** ****************************************************************************
 * A common webpack configuration.
 **************************************************************************** */
require('dotenv').config({ silent: true }); // get local environment variables from .env
const checkEnv = require('@flumens/has-env');

checkEnv({
  warn: ['APP_TRAINING', 'APP_MANUAL_TESTING', 'APP_HOST'],
  required: ['APP_SENTRY_KEY', 'APP_BACKEND_CLIENT_ID', 'APP_MAPBOX_MAP_KEY'],
});

// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const capacitorConfig = require('./capacitor.config.json');

const pkg = require('./package.json');

const ROOT_DIR = path.resolve(__dirname, './');
const DIST_DIR = path.resolve(ROOT_DIR, 'build');

const isDevEnv =
  process.env.NODE_ENV === 'development' || process.env.APP_MANUAL_TESTING;
const isProdEnv = process.env.NODE_ENV === 'production';
const isTestEnv = process.env.NODE_ENV === 'test';

const config = {
  mode: isProdEnv ? 'production' : 'development',
  entry: ['index.jsx'],
  devtool: !isProdEnv && 'source-map',
  target: 'web',

  output: {
    path: DIST_DIR,
    filename: '[name]-[chunkhash].js',
    publicPath: '/',
  },
  resolve: {
    modules: [
      path.resolve(ROOT_DIR, './node_modules/'),
      path.resolve(ROOT_DIR, './src/'),
    ],
    alias: {
      '@apps': 'common/appsBitCollection',
      config: 'common/config/config',
      helpers: 'common/helpers',
      savedSamples: 'common/models/savedSamples',
      sample: 'common/models/sample',
      occurrence: 'common/models/occurrence',
      appModel: 'common/models/appModel',
      userModel: 'common/models/userModel',
      Components: 'common/Components',
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /^((?!data\.).)*\.jsx?$/,
        exclude: /(node_modules|vendor(?!\.js))/,
        loader: 'babel-loader',
      },
      {
        test: /(\.png)|(\.svg)|(\.jpg)/,
        loader: 'file-loader?name=images/[name].[ext]',
      },
      {
        test: /(\.woff)|(\.ttf)/,
        loader: 'file-loader?name=font/[name].[ext]',
      },
      {
        test: /\.s?[c|a]ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'string-replace-loader',
            options: {
              search: './default-skin.svg',
              replace: '/images/default-skin.svg',
              flags: 'g',
            },
          },
          'css-loader?-url',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins() {
                return [autoprefixer('last 2 version')];
              },
            },
          },
          `sass-loader`,
        ],
      },
      {
        test: /\.pot?$/,
        use: [
          'json-loader',
          'po-loader?format=raw',
          {
            // removes empty translations
            loader: 'string-replace-loader',
            options: {
              search: 'msgstr ""\n\n',
              replace: '\n',
              flags: 'g',
            },
          },
        ],
      },
    ],
  },

  optimization: {
    runtimeChunk: false,
    splitChunks: {
      maxSize: isProdEnv ? 1000000 : undefined,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

  // ignore file sizes since cordova is localhost
  performance: {
    maxEntrypointSize: 10000000,
    maxAssetSize: 10000000,
  },

  plugins: [
    // Extract environmental variables and replace references with values in the code
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(process.env.NODE_ENV || 'development'),
      __DEV__: isDevEnv,
      __PROD__: isProdEnv,
      __TEST__: isTestEnv,

      'process.env': {
        // package.json variables
        APP_BUILD: JSON.stringify(
          process.env.BUILD_NUMBER || process.env.BITRISE_BUILD_NUMBER || '1'
        ),
        APP_NAME: JSON.stringify(pkg.name), // no need to be an env value
        APP_VERSION: JSON.stringify(pkg.version), // no need to be an env value

        // mandatory env. variables
        APP_BACKEND_CLIENT_ID: JSON.stringify(
          process.env.APP_BACKEND_CLIENT_ID || ''
        ),
        APP_MAPBOX_MAP_KEY: JSON.stringify(
          process.env.APP_MAPBOX_MAP_KEY || ''
        ),
        // compulsory env. variables
        APP_SENTRY_KEY: JSON.stringify(process.env.APP_SENTRY_KEY || ''),
        APP_BACKEND_INDICIA_URL: JSON.stringify(
          process.env.APP_BACKEND_INDICIA_URL || ''
        ),
        APP_BACKEND_URL: JSON.stringify(process.env.APP_BACKEND_URL || ''),

        // https://github.com/webpack-contrib/karma-webpack/issues/316
        SAUCE_LABS: JSON.stringify(process.env.SAUCE_LABS),
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      sourceMap: true,
      // https://github.com/marcelklehr/toposort/issues/20
      chunksSortMode: 'none',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
  stats: {
    children: false,
  },
  cache: true,
  devServer: {
    historyApiFallback: true,
  },
};

if (process.env.APP_MANUAL_TESTING) {
  config.entry.push('./test/manual-test-utils.js');
}

if (process.env.DEBUG_IOS) {
  const WebpackShellPluginNext = require('webpack-shell-plugin-next'); // eslint-disable-line
  // for some reason script didn't accept ~ or $HOME
  const homedir = require('os').homedir(); // eslint-disable-line
  const buildID = process.env.IOS_BUILD_ID;
  config.plugins.push(
    new WebpackShellPluginNext({
      dev: false, // run more than once
      onBuildEnd: {
        scripts: [
          'npx cap copy ios',
          'xcodebuild -workspace ./ios/App/App.xcworkspace -scheme App -sdk iphonesimulator',
          `npx ios-sim launch -d iPhone-6s-Plus ${homedir}/Library/Developer/Xcode/DerivedData/${buildID}/Build/Products/Debug-iphonesimulator/App.app -x`,
        ],
        blocking: true,
        parallel: false,
      },
    })
  );
}

if (process.env.DEBUG_ANDROID) {
  const WebpackShellPluginNext = require('webpack-shell-plugin-next'); // eslint-disable-line
  config.plugins.push(
    new WebpackShellPluginNext({
      dev: false, // run more than once
      onBuildEnd: {
        scripts: [
          'npx cap copy android',
          './android/gradlew assembleDebug -p android',
          'adb install -r android/app/build/outputs/apk/debug/app-debug.apk',
          `adb shell am start -n ${capacitorConfig.appId}/.MainActivity`,
        ],
        blocking: true,
        parallel: false,
      },
    })
  );
}

module.exports = config;
