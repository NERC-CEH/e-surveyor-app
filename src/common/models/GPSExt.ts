import { observable } from 'mobx';
import GPS from 'helpers/GPS';

const DEFAULT_ACCURACY_LIMIT = 50; // meters

export type LatLng = [number, number];

export type Location = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

const extension = () => ({
  gps: observable({ locating: '' }),

  async startGPS(
    setLocation: (newLocation: Location) => void,
    accuracyLimit = DEFAULT_ACCURACY_LIMIT
  ) {
    const that = this;
    const options = {
      accuracyLimit,

      onUpdate() {},

      callback(error: Error, location: Location) {
        if (error) {
          that.stopGPS();
          return;
        }

        if (location.accuracy <= options.accuracyLimit) {
          that.stopGPS();
        }

        setLocation(location);
      },
    };

    this.gps.locating = await GPS.start(options);
  },

  stopGPS() {
    if (!this.gps.locating) return;

    GPS.stop(this.gps.locating);
    this.gps.locating = '';
  },

  isGPSRunning() {
    return !!this.gps.locating;
  },
});

export default extension;
