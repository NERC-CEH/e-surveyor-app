import { Plugins, FilesystemDirectory } from '@capacitor/core';
import { isPlatform } from '@ionic/react';

const backendUrl =
  process.env.APP_BACKEND_URL || 'https://dev-ceh-esurveyor.pantheonsite.io'; // TODO:
const { APP_HOST: HOST = 'https://agri.app.flumens.io' } = process.env;

const indiciaUrl =
  process.env.APP_BACKEND_INDICIA_URL || 'https://warehouse1.indicia.org.uk';

const CONFIG = {
  // variables replaced on build
  version: process.env.APP_VERSION,
  build: process.env.APP_BUILD,
  name: process.env.APP_NAME,

  environment: __ENV__,
  siteUrl: HOST,

  POSITIVE_THRESHOLD: 0.7,
  POSSIBLE_THRESHOLD: 0.2,

  // use prod logging if testing otherwise full log
  log: !__TEST__,

  // error analytics
  sentry: !__TEST__ && process.env.APP_SENTRY_KEY,

  // mapping
  map: {
    mapboxApiKey: process.env.APP_MAPBOX_MAP_KEY,
    mapboxSatelliteId: 'cehapps/cipqvo0c0000jcknge1z28ejp',
  },

  promotionalWebsiteUrl: 'https://', // TODO:

  backend: {
    url: backendUrl,
    clientId: process.env.APP_BACKEND_CLIENT_ID,

    mediaUrl: `${indiciaUrl}/upload/`,

    indicia: {
      url: indiciaUrl,
      websiteId: -1, // TODO:
    },
  },
};

(async function getMediaDirectory() {
  if (isPlatform('hybrid')) {
    const { uri } = await Plugins.Filesystem.getUri({
      path: '',
      directory: FilesystemDirectory.Data,
    });
    CONFIG.dataPath = uri;
  }
})();

export default CONFIG;
