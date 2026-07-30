/** ********************************************************************
 * Manual testing functions.
 ******************************************************************** */
import track from 'json-loader!./track.geojson';
import GPS from 'mock-geolocation';
import {
  Directory as FilesystemDirectory,
  Filesystem,
} from '@capacitor/filesystem';

window.FilesystemDirectory = FilesystemDirectory;

const testing = {
  files: {
    ls: async (path = '', directory = FilesystemDirectory.Data) => {
      const { files } = await Filesystem.readdir({
        path,
        directory,
      });

      const filesWithInfo = [];
      const filesWithInfoWrap = async file => {
        const stats = await Filesystem.stat({
          path: file,
          directory,
        });

        filesWithInfo.push(stats);
      };
      files.forEach(filesWithInfoWrap);

      return filesWithInfo;
    },

    cp: async (path = '', directory = FilesystemDirectory.Data) => {
      await Filesystem.copy({
        from: path,
        to: path.split('/').pop(),
        toDirectory: directory,
      });

      return Filesystem.stat({
        path: path.split('/').pop(),
        directory,
      });
    },

    rm: async (path = '', directory = FilesystemDirectory.Data) => {
      await Filesystem.deleteFile({
        path,
        directory,
      });
    },
  },
};

testing.GPS = {
  mock: GPS.use,

  /**
   * GPS.update({ latitude: 1, longitude: -1, accuracy: 12 })
   *
   * @param options
   * @returns {*}
   */
  update(location) {
    GPS.change(location);
  },

  async simulate() {
    console.log('⌖ GPS track simulation start');

    this.mock();

    const onlyLines = feat => feat.geometry.type === 'LineString';
    const lines = track.features.filter(onlyLines);

    for (let lineId = 0; lineId < lines.length; lineId++) {
      const coords = lines[lineId].geometry.coordinates;
      for (let i = 0; i < coords.length; i++) {
        const [longitude, latitude] = coords[i];

        this.update({ latitude, longitude, accuracy: 1 });
        await new Promise(r => setTimeout(r, 1000)); //eslint-disable-line
      }
    }

    console.log('⌖ GPS track simulation complete');
  },

  stop() {
    if (this.interval || this.interval === 0) {
      clearInterval(this.interval);
    }
  },
};

window.testing = testing;
