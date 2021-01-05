/** ****************************************************************************
 * A common webpack configuration.
 **************************************************************************** */
require('dotenv').config({ silent: true });
const checkEnv = require('@flumens/has-env');
const appConfig = require('@flumens/webpack-config');

checkEnv({
  warn: ['APP_TRAINING', 'APP_MANUAL_TESTING', 'APP_HOST'],
  required: ['APP_SENTRY_KEY', 'APP_BACKEND_CLIENT_ID', 'APP_MAPBOX_MAP_KEY'],
});

module.exports = appConfig;
