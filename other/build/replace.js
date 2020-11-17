const pkg = require('../../package.json');

module.exports = grunt => ({
  // Fix double define problem
  latlon: {
    src: [
      'node_modules/geodesy/latlon-ellipsoidal.js',
      'node_modules/geodesy/latlon-spherical.js',
    ],
    overwrite: true,
    replacements: [
      {
        from:
          "if (typeof module != 'undefined' && module.exports) " +
          'module.exports.Vector3d = Vector3d;',
        to: '',
      },
      {
        from:
          "if (typeof define == 'function' && define.amd) " +
          'define([], function() { return Vector3d; });',
        to: '',
      },
      {
        from:
          "if (typeof define == 'function' && define.amd) " +
          "define(['Dms'], function() { return LatLon; });",
        to: '',
      },
    ],
  },

  // Cordova config changes
  cordova_config: {
    src: ['cordova.xml'],
    dest: 'dist/cordova/config.xml',
    replacements: [
      {
        from: /\{APP_VER\}/g, // string replacement
        to: () => pkg.version,
      },
      {
        from: /\{APP_TITLE\}/g,
        to: () => pkg.title,
      },
      {
        from: /\{APP_DESCRIPTION\}/g,
        to: () => pkg.description,
      },
      {
        from: /\{BUNDLE_VER\}/g,
        to: () => pkg.build,
      },
    ],
  },
});
