require('dotenv').config({ silent: true }); // get local environment variables from .env
const fs = require('fs');
const pkg = require('./package.json');

const VERSION = pkg.version;
const BUILD = process.env.BUILD_NUMBER || process.env.BITRISE_BUILD_NUMBER || 1;

const exec = grunt => ({
  build: {
    command: 'npm run clean && NODE_ENV=production npm run build',
  },
  resources: {
    command: () => {
      return `mkdir -p resources &&
                cp -R other/designs/android resources &&
                cp -R other/designs/splash.png resources &&

                ./node_modules/.bin/sharp -i other/designs/icon.svg -o resources/icon.png resize 1024 1024 -- removeAlpha &&

                ./node_modules/.bin/cordova-res ios --skip-config --resources resources --copy &&
                ./node_modules/.bin/cordova-res android --skip-config --resources resources --copy`;
    },
    stdout: false,
  },
  init: {
    command: './node_modules/.bin/cap sync',
    stdout: false,
  },
  build_android: {
    command() {
      if (!process.env.KEYSTORE_PATH) {
        throw new Error('KEYSTORE_PATH env variable is missing.');
      }

      if (!process.env.KEYSTORE_ALIAS) {
        throw new Error('KEYSTORE_ALIAS env variable is missing.');
      }

      const pass = grunt.config('keystore-password');
      if (!pass) {
        throw new Error('KEYSTORE_PATH password is missing.');
      }

      return `cd android && 
              ./gradlew assembleRelease && 
              cd app/build/outputs/apk/release &&
              jarsigner -keystore ${process.env.KEYSTORE_PATH} -storepass ${pass} app-release-unsigned.apk ${process.env.KEYSTORE_ALIAS} &&
              zipalign 4 app-release-unsigned.apk app-release.apk &&
              mv -f app-release.apk ../../../../../`;
    },

    stdout: false,
    stdin: true,
  },
  build_ios: {
    command() {
      const capacitorConf = require('./capacitor.config.json'); //eslint-disable-line

      if (!process.env.ITUNES_TEAM_ID) {
        throw new Error('ITUNES_TEAM_ID env variable is missing.');
      }

      const iosExportFlags = `
        <?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
        <plist version="1.0">
          <dict>
            <key>compileBitcode</key>
            <true/>

            <key>provisioningProfiles</key>
            <dict>
              <key>${capacitorConf.appId}</key>
              <string>${capacitorConf.appId}</string>
            </dict>

            <key>method</key>
            <string>app-store</string>

            <key>signingStyle</key>
            <string>manual</string>

            <key>teamID</key>
            <string>${process.env.ITUNES_TEAM_ID}</string>
          </dict>
        </plist>
        `;

      return `cd ios/App && 
              rm -rf exports && 
              xcodebuild -workspace App.xcworkspace -scheme App archive -archivePath "exports/App" &&
              echo '${iosExportFlags}' > exports/export.plist && 
              xcodebuild -exportArchive -archivePath "exports/App.xcarchive" -exportPath "./exports" -exportOptionsPlist "./exports/export.plist" -allowProvisioningUpdates`;
    },

    stdout: false,
    stdin: true,
  },
  deploy_ios: {
    command() {
      if (!process.env.ITUNES_USER_EMAIL) {
        throw new Error('ITUNES_USER_EMAIL env variable is missing.');
      }

      const pass = grunt.config('itunes-app-password');
      if (!pass) {
        throw new Error('iTunes App password is missing.');
      }

      return `cd ios/App && 
              xcrun altool --upload-app --type ios --file "exports/App.ipa" -u "${process.env.ITUNES_USER_EMAIL}" -p "${pass}"`;
    },

    stdout: false,
    stdin: true,
  },
  create_tag: {
    command: `git tag v${VERSION}-${BUILD}`,

    stdout: false,
    stdin: true,
  },
});

const setVersionAndBuild = () => {
  function replaceAll(str, find, replace) {
    // node doesn't yet support replaceAll
    return str.replace(new RegExp(find, 'g'), replace);
  }

  // Android
  let file = fs.readFileSync('./android/app/build.gradle', 'utf8');
  file = file.replace(/versionName "(\d\.)+\d"/i, `versionName "${VERSION}"`);
  file = file.replace(/versionCode \d+/i, `versionCode ${BUILD}`);
  fs.writeFileSync('./android/app/build.gradle', file, 'utf8');

  // iOS
  file = fs.readFileSync('./ios/App/App.xcodeproj/project.pbxproj', 'utf8');
  file = replaceAll(
    file,
    /MARKETING_VERSION = (\d\.)+\d;/i,
    `MARKETING_VERSION = ${VERSION};`
  );
  file = replaceAll(
    file,
    /CURRENT_PROJECT_VERSION = \d+/i,
    `CURRENT_PROJECT_VERSION = ${BUILD}`
  );
  fs.writeFileSync('./ios/App/App.xcodeproj/project.pbxproj', file, 'utf8');
};

const prompt = {
  keystore: {
    options: {
      questions: [
        {
          name: 'keystore-password',
          type: 'password',
          message: 'Please enter keystore password:',
        },
      ],
    },
  },
  itunes_app_pass: {
    options: {
      questions: [
        {
          name: 'itunes-app-password',
          type: 'password',
          message: 'Please enter iTunes App password:',
        },
      ],
    },
  },
};

function init(grunt) {
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-prompt');

  grunt.initConfig({
    exec: exec(grunt),
    prompt,
  });
}

const initWrap = grunt => {
  init(grunt);

  grunt.registerTask('default', [
    'exec:build',

    'exec:init',
    'exec:resources',

    'set_version_and_build',
    'prompt:keystore',
    'exec:build_android',
    'exec:build_ios',
    'prompt:itunes_app_pass',
    // 'exec:deploy_ios',

    'exec:create_tag',
    'checklist',
  ]);

  grunt.registerTask('set_version_and_build', setVersionAndBuild);

  const registerTaskWrap = () => {
    const Reset = '\x1b[0m';
    const FgGreen = '\x1b[32m';
    const FgYellow = '\x1b[33m';
    const FgCyan = '\x1b[36m';

    const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8');

    const versionExistsInChangelog = changelog.includes(VERSION);
    if (!versionExistsInChangelog) {
      console.log(FgYellow);
      console.log('WARN:');
      console.log(`* Have you updated CHANGELOG.md?`);
    } else {
      console.log(FgGreen);
      console.log('Success! 👌');
    }

    console.log(FgCyan);
    console.log('NEXT:');
    console.log(`* Update screenshots.`);
    console.log(`* Update descriptions.`);

    console.log(Reset);
  };

  grunt.registerTask('checklist', registerTaskWrap);
};

module.exports = initWrap;
