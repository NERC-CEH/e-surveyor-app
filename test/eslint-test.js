const lint = require('mocha-eslint');

const paths = ['./+(src|test)/**/*.{js,jsx}'];
lint(paths, {
  formatter: 'compact', // Defaults to `stylish`
  alwaysWarn: false, // Defaults to `true`, always show warnings
  timeout: 5000, // Defaults to the global mocha `timeout` option
});
