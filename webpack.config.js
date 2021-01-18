/** ****************************************************************************
 * A common webpack configuration.
 **************************************************************************** */
require('dotenv').config({ silent: true });
const webpack = require('webpack');
const checkEnv = require('@flumens/has-env');
const appConfig = require('@flumens/webpack-config');
const pkg = require('./package.json');

checkEnv({
  warn: ['APP_BACKEND_URL', 'APP_BACKEND_INDICIA_URL'],
  required: ['APP_SENTRY_KEY', 'APP_BACKEND_CLIENT_ID', 'APP_MAPBOX_MAP_KEY'],
});

appConfig.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env': {
      APP_BUILD: JSON.stringify(
        process.env.BUILD_NUMBER || process.env.BITRISE_BUILD_NUMBER || 'dev'
      ),
      APP_VERSION: JSON.stringify(pkg.version),
      APP_BACKEND_CLIENT_ID: JSON.stringify(
        process.env.APP_BACKEND_CLIENT_ID || ''
      ),
      APP_BACKEND_CLIENT_PASS: JSON.stringify(
        process.env.APP_BACKEND_CLIENT_PASS || ''
      ),
      APP_MAPBOX_MAP_KEY: JSON.stringify(process.env.APP_MAPBOX_MAP_KEY || ''),
      APP_SENTRY_KEY: JSON.stringify(process.env.APP_SENTRY_KEY || ''),
      APP_BACKEND_INDICIA_URL: JSON.stringify(
        process.env.APP_BACKEND_INDICIA_URL || ''
      ),
      APP_BACKEND_URL: JSON.stringify(process.env.APP_BACKEND_URL || ''),
    },
  })
);

module.exports = appConfig;
