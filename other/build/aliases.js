module.exports = grunt => ({
  default: ['init', 'webpack:main'],

  init: ['init:validate'],

  'init:validate': () => {
    if (process.env.APP_FORCE) {
      grunt.option('force', true);
    }

    // check for missing env vars
    ['APP_SENTRY_KEY', 'PLANT_NET_API_KEY'].forEach(setting => {
      if (!process.env[setting]) {
        grunt.warn(`${setting} env variable is missing`);
      }
    });
  },

  update: ['webpack:main'],
});